import type { WorkoutFormData } from '$lib/layouts/WorkoutForm.svelte';
import type { RequestHandler } from '@sveltejs/kit';
import { request } from 'http';

export const POST: RequestHandler = async ({ locals: { supabase }, request }) => {
	const workout: WorkoutFormData = await request.json();
	const { data, error } = await supabase
		.from('workouts')
		.insert({
			name: workout.name,
			description: workout.description
		})
		.select('id')
		.single();

	if (error) console.error(error);

	if (data?.id)
		await supabase.from('workouts_exercises').insert(
			workout.exercises.map((exercise) => ({
				exercise_id: exercise.exercise.id,
				workout_id: data.id,
				sets: exercise.sets,
				repetitions: exercise.repetitions,
				rest: exercise.rest,
				notes: exercise.notes
			}))
		);

	if (error) console.error(error);

	return new Response(JSON.stringify(data));
};
