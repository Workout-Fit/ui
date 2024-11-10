import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

export const getExercises = (supabase: SupabaseClient<Database>) =>
	supabase.from('exercises').select();
