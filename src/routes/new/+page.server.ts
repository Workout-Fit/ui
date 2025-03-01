import { exerciseFormSchema } from '$lib/forms/ExerciseForm.svelte';
import { workoutFormSchema } from '$lib/forms/WorkoutForm.svelte';
import { i18n } from '$lib/i18n';
import { error, fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import * as m from '$lib/paraglide/messages';

export const load = async () => {
	const workoutForm = await superValidate(zod(workoutFormSchema));
	const exerciseForm = await superValidate(zod(exerciseFormSchema));

	return { form: workoutForm, exerciseFormData: exerciseForm };
};

export const actions = {
	workout: async ({ locals: { supabase }, request, cookies }) => {
		const form = await superValidate(request, zod(workoutFormSchema));

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
			return message(form, { text: 'Failed to create Workout', type: 'error' }, { status: 500 });
		}

		if (form.data.exercises.length > 0) {
			const createExercises = await supabase.from('workouts_exercises').insert(
				form.data.exercises.map((exercise) => ({
					exercise_id: exercise.exercise.id,
					workout_id: createWorkout.data.id,
					sets: exercise.sets,
					repetitions: exercise.repetitions,
					rests: exercise.rests as number[],
					notes: exercise.notes
				}))
			);

			if (createExercises.error) {
				console.error(createExercises.error);
				return error(500, 'Failed to create Workout Exercises');
			}
		}

		return redirect(
			i18n.resolveRoute(`/workouts/${createWorkout.data.id}`),
			{ text: m.create_workout_success(), type: 'success' },
			cookies
		);
	},
	exercise: async ({ request }) => {
		const form = await superValidate(request, zod(exerciseFormSchema));
		if (!form.valid) return fail(400, { form });
		return { form };
	}
};
