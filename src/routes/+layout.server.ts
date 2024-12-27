import { getProfile } from '$lib/supabase/queries/getProfile';

export const load = async ({ locals: { safeGetSession, supabase }, cookies }) => {
	const { session } = await safeGetSession();

	return {
		session,
		cookies: cookies.getAll(),
		username: session ? (await getProfile(supabase, session.user.id)).data?.username : undefined
	};
};
