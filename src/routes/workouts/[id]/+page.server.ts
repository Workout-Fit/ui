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
