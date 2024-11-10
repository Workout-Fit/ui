import { getWorkouts } from '$lib/supabase/queries/workout';

export const load = async ({ locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();

	const { data: workouts } = await getWorkouts(supabase, { userId: user?.id as string });

	return { workouts };
};
