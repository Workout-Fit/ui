import type { EmailOtpType } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type') as EmailOtpType | null;
	const redirectUri = url.searchParams.get('redirect_uri') ?? '/';

	const redirectTo = new URL(url);
	redirectTo.pathname = redirectUri.replace(url.origin, '');
	redirectTo.searchParams.delete('token_hash');
	redirectTo.searchParams.delete('type');

	if (token_hash && type) {
		const { error } = await supabase.auth.verifyOtp({ type, token_hash });
		if (!error) {
			redirectTo.searchParams.delete('next');
			redirect(303, redirectTo);
		}
		console.error(error);
	}
	redirectTo.pathname = '/auth/error';
	redirect(303, redirectTo);
};
