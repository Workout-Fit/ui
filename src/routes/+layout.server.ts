import { getProfile } from '$lib/supabase/queries/getProfile';

export const load = async ({ locals: { safeGetSession }, cookies }) => ({
	session: await safeGetSession(),
	cookies: cookies.getAll()
});
