export const load = async ({ locals: { safeGetSession, supabase }, cookies }) => {
	const { session } = await safeGetSession();

	return {
		session,
		cookies: cookies.getAll(),
		username: session
			? (await supabase.from('profiles').select('username').eq('user_id', session.user.id).single())
					.data?.username
			: undefined
	};
};
