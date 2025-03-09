import getAvatar from '$lib/supabase/queries/getAvatar.js';
import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async ({ locals: { safeGetSession, supabase }, cookies }) => {
	const session = await safeGetSession();
	return {
		avatar: session.user ? await getAvatar(supabase, session.user.id) : undefined,
		session,
		cookies: cookies.getAll()
	};
});
