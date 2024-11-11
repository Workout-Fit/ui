export const load = async ({ locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	const { data: workouts } = await supabase
		.from('workouts')
		.select(`id, name, description, exercises(count)`)
		.eq('user_id', user?.id as string)
		.order('creation_date', { ascending: false });

	return { workouts: workouts ?? [] };
};
