import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

export const getProfileByUsername = (supabase: SupabaseClient<Database>, username: string) =>
	supabase
		.from('profiles')
		.select()
		.eq('username', username)
		.order('created_at', { ascending: false })
		.limit(1)
		.single();

export const getProfile = (supabase: SupabaseClient<Database>, id: string) =>
	supabase
		.from('profiles')
		.select()
		.eq('user_id', id)
		.limit(1)
		.order('created_at', { ascending: false })
		.single();
