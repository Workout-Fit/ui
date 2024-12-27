import type { WorkoutFormData } from '$lib/forms/WorkoutForm.svelte';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals: { supabase }, request }) => {
	const workout: WorkoutFormData = await request.json();
	const createWorkout = await supabase
		.from('workouts')
		.insert({
			name: workout.name,
			description: workout.description
		})
		.select('id')
		.single();

	if (createWorkout.error) {
		console.error(createWorkout.error);
		return error(500, 'Failed to create Workout');
	}

	const createExercises = await supabase.from('workouts_exercises').insert(
		workout.exercises.map((exercise) => ({
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

	return json(createWorkout.data);
};
