import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { workoutFormSchema } from '$lib/forms/WorkoutForm.svelte';
import type { z } from 'zod';

const updateWorkout = async (
	supabase: SupabaseClient<Database>,
	workout: z.infer<typeof workoutFormSchema> & { id: string }
) =>
	Promise.all([
		supabase
			.from('workouts')
			.update({
				name: workout.name,
				description: workout.description
			})
			.eq('id', workout.id as string)
			.single(),
		supabase.rpc('update_workouts_exercises', {
			exercises: workout.exercises.map(({ exercise, ...rest }) => ({
				...rest,
				workout_id: workout.id,
				exercise_id: exercise.id
			}))
		})
	]);

export default updateWorkout;
