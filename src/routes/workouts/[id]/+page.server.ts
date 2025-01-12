import { error, redirect } from '@sveltejs/kit';
import omit from 'lodash/omit';

export const load = async ({ locals: { supabase, safeGetSession }, params, depends }) => {
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

	return { workout: omit(workout, 'user_id'), editable: workout?.user_id === user?.id };
};

export const actions = {
	clone: async ({ params: { id }, locals: { supabase, safeGetSession } }) => {
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
	},
	like: async ({ params: { id }, locals: { supabase, safeGetSession }, request }) => {
		const formData = await request.formData();
		const { user } = await safeGetSession();

		if (!user) return error(403, 'Forbidden');

		const { error: likeError } =
			formData.get('liked') === 'true'
				? await supabase.from('workouts_likes').delete().eq('workout_id', id).eq('user_id', user.id)
				: await supabase.from('workouts_likes').insert({ workout_id: id, user_id: user.id });

		if (likeError) {
			console.log(likeError);
			return error(500, 'Failed to like workout');
		}
	}
};
