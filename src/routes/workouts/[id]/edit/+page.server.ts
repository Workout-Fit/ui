import { exerciseFormSchema } from '$lib/forms/ExerciseForm.svelte';
import { workoutFormSchema } from '$lib/forms/WorkoutForm.svelte';
import updateWorkout from '$lib/supabase/queries/updateWorkout.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

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
	const workoutForm = await superValidate(workout, zod(workoutFormSchema));
	const exerciseForm = await superValidate(zod(exerciseFormSchema));

	if (workout?.user_id === user?.id) return { form: workoutForm, exerciseForm };
	return redirect(302, `/workouts/${params.id}`);
};

export const actions = {
	workout: async ({ locals: { supabase, user }, request, params }) => {
		const form = await superValidate(request, zod(workoutFormSchema));
		if (!user) return error(401, 'Unauthorized');

		if (!form.valid) return fail(400, { form });

		const [updateWorkoutResponse, updateWorkoutExercisesResponse] = await updateWorkout(supabase, {
			id: params.id,
			...form.data
		});

		if (updateWorkoutResponse.error || updateWorkoutExercisesResponse.error) {
			console.error(updateWorkoutResponse.error ?? updateWorkoutExercisesResponse.error);
			return error(500, 'Failed to update workout');
		}

		return redirect(302, `/workouts/${params.id}`);
	},
	exercise: async ({ request }) => {
		const form = await superValidate(request, zod(exerciseFormSchema));
		if (!form.valid) return fail(400, { form });

		return { form };
	}
};
