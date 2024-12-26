import getWorkouts from '$lib/supabase/queries/getWorkouts';
import { error } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) return error(403, 'Forbidden');

	const { data: workouts } = await getWorkouts(supabase, user.id);
	return { workouts: workouts ?? [] };
};
