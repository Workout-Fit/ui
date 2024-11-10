import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

export const getWorkouts = async (
	supabase: SupabaseClient<Database>,
	{ userId }: { userId: string }
) =>
	supabase
		.from('workouts')
		.select(
			`
  id,
  name,
  description,
  exercises(count)
`
		)
		.eq('user_id', userId as string)
		.order('created_at', { ascending: false });
