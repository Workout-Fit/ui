import getWorkouts from '$lib/supabase/queries/getWorkouts';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { localizeHref } from '$lib/paraglide/runtime';

export const load = async ({ locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) return error(403, 'Forbidden');

	const { data: workouts, error: workoutsError } = await getWorkouts(supabase, user.id);

	if (workoutsError) {
		console.error(workoutsError);
		return error(500, `Failed to fetch Workouts`);
	}

	return { workouts: workouts ?? [] };
};

export const actions: Actions = {
	signout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		redirect(303, localizeHref('/auth'));
	}
};
