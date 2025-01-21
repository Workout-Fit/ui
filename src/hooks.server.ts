import { i18n } from '$lib/i18n';
import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const PUBLIC_URLS = ['/auth', '/workouts/[id]', '/auth/reset', '/auth/sso', '/profile/[username]'];

const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error) {
			console.error(error);
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders: (name) =>
			name === 'content-range' || name === 'x-supabase-api-version'
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	const requestUrl = new URL(event.request.url);
	event.locals.session = session;
	event.locals.user = user;

	if (!event.locals.session && !PUBLIC_URLS.includes(event.route.id as string))
		redirect(
			303,
			i18n.resolveRoute('/auth?redirect_uri=' + requestUrl.pathname.replace('__data.json', ''))
		);
	if (event.locals.session && event.url.pathname === '/auth') redirect(303, i18n.resolveRoute('/'));

	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard, i18n.handle());
