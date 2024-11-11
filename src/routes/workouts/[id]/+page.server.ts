export const load = async ({ locals: { supabase }, params }) => {
	const { data: workout } = await supabase
		.from('workouts')
		.select(
			`
      id,
      description,
      name,
      based_on,
      creation_date,
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

	return { workout };
};
