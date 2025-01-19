import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

const getWorkouts = async (supabase: SupabaseClient<Database>, userId: string) =>
	supabase
		.from('workouts')
		.select(`id, name, notes, exercises(count)`)
		.eq('user_id', userId as string)
		.order('creation_date', { ascending: false });

export default getWorkouts;
