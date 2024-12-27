import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import { processAvatar } from '$lib/utils/image';

const insertAvatar = async (supabase: SupabaseClient<Database>, userId: string, avatar: File) => {
	const processedAvatar = await processAvatar(new Uint8Array(await avatar.arrayBuffer()));

	return supabase.storage
		.from('avatars')
		.upload(`${userId}/avatar.webp`, new Blob([processedAvatar], { type: 'image/webp' }), {
			upsert: true
		});
};

const insertProfile = async (
	supabase: SupabaseClient<Database>,
	data: Database['public']['Tables']['profiles']['Insert'],
	avatar?: File
) =>
	Promise.all([
		supabase.from('profiles').insert(data),
		avatar ? insertAvatar(supabase, data.user_id, avatar) : undefined
	]);

export default insertProfile;
