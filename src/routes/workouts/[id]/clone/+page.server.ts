import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { supabase, safeGetSession } }) => {
	const { id } = params;
	const { user } = await safeGetSession();
	if (!user) return error(403, 'Forbidden');

	const { data: workoutId, error: cloneError } = await supabase.rpc('clone_workout', {
		source_workout_id: id,
		target_user_id: user.id
	});

	if (cloneError) {
		console.log(cloneError);
		return error(500, 'Failed to clone workout');
	}
	return redirect(302, `/workouts/${workoutId}?showToast=clone-success`);
};
