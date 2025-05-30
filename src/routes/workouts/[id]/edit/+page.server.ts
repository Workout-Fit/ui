import { exerciseFormSchema } from '$lib/forms/ExerciseForm.svelte';
import { workoutFormSchema } from '$lib/forms/WorkoutForm.svelte';
import { getLocale } from '$lib/paraglide/runtime';
import updateWorkout from '$lib/supabase/queries/updateWorkout.js';
import { parseWorkoutExercises } from '$lib/utils/parser';
import { error, fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
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
      creation_date,
      user_id,
      exercises:workouts_exercises(
        id,
        exercise_id,
        exercise:exercises(id, i18n:exercises_i18n(name)),
        sets,
        repetitions,
        rests,
        notes
      )
    `
		)
		.eq('exercises.exercise.i18n.language', getLocale())
		.eq('id', params.id)
		.single();

	if (workoutError) {
		console.error(workoutError);
		return error(500, 'Failed to load workout');
	}

	if (!workout) return error(404, 'Workout not found');

	const workoutForm = await superValidate(parseWorkoutExercises(workout), zod(workoutFormSchema));
	const exerciseForm = await superValidate(zod(exerciseFormSchema));

	return workout?.user_id === user?.id
		? { form: workoutForm, exerciseFormData: exerciseForm }
		: redirect(303, `/workouts/${params.id}`);
};

export const actions = {
	workout: async ({ locals: { supabase, user }, request, params, cookies }) => {
		const form = await superValidate(request, zod(workoutFormSchema));
		if (!user) return error(401, 'Unauthorized');

		if (!form.valid) return fail(400, { form });

		const [updateWorkoutResponse, updateWorkoutExercisesResponse] = await updateWorkout(supabase, {
			id: params.id,
			...form.data,
			exercises: form.data.exercises.map((exercise) => ({
				...exercise,
				id: exercise.id && isNaN(exercise.id as number) ? undefined : exercise.id
			}))
		});

		if (updateWorkoutResponse.error || updateWorkoutExercisesResponse.error) {
			console.error(updateWorkoutResponse.error ?? updateWorkoutExercisesResponse.error);
			return message(form, { text: 'Failed to update workout', type: 'error' }, { status: 500 });
		}

		return redirect(
			`/workouts/${params.id}`,
			{ text: m.edit_workout_success(), type: 'success' },
			cookies
		);
	},
	exercise: async ({ request }) => {
		const form = await superValidate(request, zod(exerciseFormSchema));
		if (!form.valid) return fail(400, { form });

		return { form };
	}
};
