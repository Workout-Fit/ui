import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import { processAvatar } from '$lib/utils/image';

const insertProfile = async (
	supabase: SupabaseClient<Database>,
	data: Database['public']['Tables']['profiles']['Insert'],
	avatar?: File
) =>
	Promise.all([
		supabase.from('profiles').insert(data),
		avatar
			? supabase.storage
					.from('avatars')
					.upload(
						`${data.user_id}.webp`,
						await processAvatar(new Uint8Array(await avatar.arrayBuffer())),
						{ upsert: true }
					)
			: undefined
	]);

export default insertProfile;
