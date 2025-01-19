import { exerciseFormSchema } from '$lib/forms/ExerciseForm.svelte';
import { workoutFormSchema } from '$lib/forms/WorkoutForm.svelte';
import { i18n } from '$lib/i18n';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const workoutForm = await superValidate(zod(workoutFormSchema));
	const exerciseForm = await superValidate(zod(exerciseFormSchema));

	return { form: workoutForm, exerciseForm };
};

export const actions = {
	workout: async ({ locals: { supabase, user }, request }) => {
		const form = await superValidate(request, zod(workoutFormSchema));
		if (!user) return error(401, 'Unauthorized');

		if (!form.valid) return fail(400, { form });

		const createWorkout = await supabase
			.from('workouts')
			.insert({
				name: form.data.name,
				notes: form.data.notes
			})
			.select('id')
			.single();

		if (createWorkout.error) {
			console.error(createWorkout.error);
			return error(500, 'Failed to create Workout');
		}

		if (form.data.exercises.length > 0) {
			const createExercises = await supabase.from('workouts_exercises').insert(
				form.data.exercises.map((exercise) => ({
					exercise_id: exercise.exercise.id,
					workout_id: createWorkout.data.id,
					sets: exercise.sets,
					repetitions: exercise.repetitions,
					rest: exercise.rest,
					notes: exercise.notes
				}))
			);

			if (createExercises.error) {
				console.error(createExercises.error);
				return error(500, 'Failed to create Workout Exercises');
			}
		}

		return redirect(302, i18n.resolveRoute(`/workouts/${createWorkout.data.id}`));
	},
	exercise: async ({ request }) => {
		debugger;
		const form = await superValidate(request, zod(exerciseFormSchema));
		if (!form.valid) return fail(400, { form });
		return { form };
	}
};
