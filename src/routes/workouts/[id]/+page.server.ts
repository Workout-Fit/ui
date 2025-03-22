import { getLocale } from '$lib/paraglide/runtime';
import { parseWorkoutExercises } from '$lib/utils/parser';
import { error } from '@sveltejs/kit';
import omit from 'lodash/omit';
import { redirect } from 'sveltekit-flash-message/server';
import { m } from '$lib/paraglide/messages';

export const load = async ({ locals: { supabase, safeGetSession }, params }) => {
	const { user } = await safeGetSession();
	const { data: workout, error: workoutError } = await supabase
		.from('workouts')
		.select(
			`
      id,
      notes,
      name,
      based_on(
        id,
        name
      ),
      creation_date,
      user_id,
      exercises:workouts_exercises(
        exercise_id,
        exercise:exercises(
          id,
          i18n:exercises_i18n(name)
        ),
        sets,
        repetitions,
        rests,
        notes
      ),
      profile(username)
    `
		)
		.eq('exercises.exercise.i18n.language', getLocale())
		.eq('id', params.id)
		.maybeSingle();

	if (workoutError) {
		console.error(workoutError);
		return error(500, 'Error when retrieving workout');
	}
	if (!workout) return error(404, 'Workout not found');

	return {
		workout: parseWorkoutExercises(omit(workout, 'user_id')),
		editable: workout?.user_id === user?.id
	};
};

export const actions = {
	clone: async ({ params: { id }, locals: { supabase, safeGetSession }, url, cookies }) => {
		const { user } = await safeGetSession();

		if (!user)
			return redirect(
				307,
				'/auth?redirect_uri=' + url.pathname,
				{
					text: m.demand_sign_in({
						action: {
							en: 'clone a workout',
							['pt-br']: 'clonar uma ficha'
						}
					}),
					type: 'error'
				},
				cookies
			);

		const { data: workoutId, error: cloneError } = await supabase.rpc('clone_workout', {
			source_workout_id: id,
			target_user_id: user.id
		});

		if (cloneError) {
			console.error(cloneError);
			return error(500, 'Failed to clone workout');
		}
		return redirect(
			`/workouts/${workoutId}`,
			{ text: m.workout_clone_success(), type: 'success' },
			cookies
		);
	},
	like: async ({ params: { id }, locals: { supabase, safeGetSession }, request, url, cookies }) => {
		const formData = await request.formData();
		const { user } = await safeGetSession();

		if (!user)
			return redirect(
				307,
				'/auth?redirect_uri=' + url.pathname,
				{
					text: m.demand_sign_in({
						action: {
							en: 'like a workout',
							['pt-br']: 'curtir uma ficha'
						}
					}),
					type: 'error'
				},
				cookies
			);

		const { error: likeError } =
			formData.get('liked') === 'true'
				? await supabase.from('workouts_likes').delete().eq('workout_id', id).eq('user_id', user.id)
				: await supabase.from('workouts_likes').insert({ workout_id: id, user_id: user.id });

		if (likeError) {
			console.error(likeError);
			return error(500, 'Failed to like workout');
		}
	},
	['delete']: async ({ params: { id }, locals: { supabase }, cookies }) => {
		const { error: deleteWorkoutError } = await supabase.from('workouts').delete().eq('id', id);

		if (deleteWorkoutError) {
			console.error(deleteWorkoutError);
			return error(500, 'Failed to delete workout');
		}

		return redirect('/', { text: m.workout_delete_success(), type: 'success' }, cookies);
	}
};
