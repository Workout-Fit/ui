import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, safeGetSession }, params }) => {
	const { user } = await safeGetSession();
	const { data: workout } = await supabase
		.from('workouts')
		.select(
			`
      id,
      description,
      name,
      based_on(
        id,
        name
      ),
      creation_date,
      user_id,
      profile(username),
      exercises:workouts_exercises(
        exercise_id,
        exercise:exercises(id, name),
        sets,
        repetitions,
        rest,
        notes
      )
    `
		)
		.eq('id', params.id)
		.single();

	return { workout: { ...workout, user_id: undefined }, editable: workout?.user_id === user?.id };
};

export const actions = {
	clone: async ({ params, locals: { supabase, safeGetSession } }) => {
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
		return redirect(302, `/workouts/${workoutId}`);
	}
};
