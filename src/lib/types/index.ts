import type { Database } from '$lib/supabase/database.types';

export type WorkoutExercise = Omit<
	Database['public']['Tables']['workouts_exercises']['Row'],
	'workout_id' | 'exercise_id'
> & {
	exercise: Pick<Database['public']['Tables']['exercises']['Row'], 'name' | 'id'>;
};
