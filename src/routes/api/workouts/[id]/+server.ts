import type { WorkoutFormData } from '$lib/layouts/WorkoutForm.svelte';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ locals: { supabase }, request, params }) => {
	if (params.id === undefined) return error(400, 'Missing workout ID');

	const workout: WorkoutFormData = await request.json();

	const [updateWorkout, updateWorkoutExercises] = await Promise.all([
		supabase
			.from('workouts')
			.update({
				name: workout.name,
				description: workout.description
			})
			.eq('id', params.id as string)
			.single(),
		supabase.rpc('update_workouts_exercises', {
			exercises: workout.exercises.map(({ exercise, ...rest }) => ({
				...rest,
				workout_id: params.id?.toString() as string,
				exercise_id: exercise.id
			}))
		})
	]);

	if (updateWorkout.error || updateWorkoutExercises.error) {
		console.error(updateWorkout.error ?? updateWorkoutExercises.error);
		return error(500, 'Failed to update workout');
	}

	return json(updateWorkout.data);
};
