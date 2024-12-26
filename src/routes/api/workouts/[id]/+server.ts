import type { WorkoutFormData } from '$lib/layouts/WorkoutForm.svelte';
import updateWorkout from '$lib/supabase/queries/updateWorkout';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ locals: { supabase }, request, params }) => {
	if (params.id === undefined) return error(400, 'Missing workout ID');

	const workout: WorkoutFormData = await request.json();

	const [updateWorkoutResponse, updateWorkoutExercisesResponse] = await updateWorkout(supabase, {
		...workout,
		id: params.id
	});

	if (updateWorkoutResponse.error || updateWorkoutExercisesResponse.error) {
		console.error(updateWorkoutResponse.error ?? updateWorkoutExercisesResponse.error);
		return error(500, 'Failed to update workout');
	}

	return json(updateWorkoutResponse.data);
};
