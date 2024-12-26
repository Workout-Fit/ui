import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

export const getProfileByUsername = (supabase: SupabaseClient<Database>, username: string) =>
	supabase
		.from('profiles')
		.select()
		.eq('username', username)
		.order('created_at', { ascending: false })
		.single();

export const getProfile = (supabase: SupabaseClient<Database>, id: string) =>
	supabase
		.from('profiles')
		.select()
		.eq('user_id', id)
		.order('created_at', { ascending: false })
		.single();
