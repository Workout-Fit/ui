import type { Database } from '$lib/supabase/database.types';

export type WorkoutExercise = Omit<
	Database['public']['Tables']['workouts_exercises']['Row'],
	'workout_id' | 'exercise_id'
> & {
	exercise: Pick<Database['public']['Tables']['exercises']['Row'], 'id'> &
		Pick<Database['public']['Tables']['exercises_i18n']['Row'], 'name'>;
};

export type Profile = Omit<
	Database['public']['Tables']['profiles']['Row'],
	'user_id' | 'created_at'
>;
