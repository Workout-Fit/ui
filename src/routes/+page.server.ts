import getWorkouts from '$lib/supabase/queries/getWorkouts';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { i18n } from '$lib/i18n';

export const load = async ({ locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) return error(403, 'Forbidden');

	const { data: workouts } = await getWorkouts(supabase, user.id);
	return { workouts: workouts ?? [] };
};

export const actions: Actions = {
	signout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		redirect(303, i18n.resolveRoute('/auth'));
	}
};
