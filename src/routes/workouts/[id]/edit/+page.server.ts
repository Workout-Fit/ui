import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, safeGetSession }, params }) => {
	const { user } = await safeGetSession();
	const { data: workout } = await supabase
		.from('workouts')
		.select(
			`
      id,
      description,
      name,
      based_on,
      creation_date,
      user_id,
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

	if (workout?.user_id === user?.id) return { workout: { ...workout, user_id: undefined } };

	return redirect(302, `/workouts/${params.id}`);
};
