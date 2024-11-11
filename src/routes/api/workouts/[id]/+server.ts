import type { WorkoutFormData } from '$lib/layouts/WorkoutForm.svelte';
import type { RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ locals: { supabase }, request, params }) => {
	if (params.id === undefined) return new Response(null, { status: 400 });

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
			workoutId: params.id,
			exercises: workout.exercises.map(({ exercise, ...rest }) => ({
				...rest,
				workout_id: params.id,
				exercise_id: exercise.id
			}))
		})
	]);

	if (updateWorkout.error || updateWorkoutExercises.error)
		console.error(updateWorkout.error ?? updateWorkoutExercises.error);

	return new Response(JSON.stringify(updateWorkout.data));
};
