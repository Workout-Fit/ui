import type SupabaseClient from '@supabase/supabase-js/dist/module/SupabaseClient';
import type { Database } from '../database.types';

export const getExercises = async (
	supabase: SupabaseClient<Database>,
	query: string,
	language: string
) =>
	supabase
		.from('exercises_i18n')
		.select('name, ...exercises(id)')
		.eq('language', language)
		.ilike('name', `%${query.trim()}%`)
		.limit(20);
