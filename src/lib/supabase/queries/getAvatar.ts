import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

const getAvatar = async (supabase: SupabaseClient<Database>, userId: string) => {
	const { data: avatarExists } = await supabase.storage
		.from('avatars')
		.exists(`${userId}/avatar.webp`);

	return avatarExists
		? supabase.storage.from('avatars').getPublicUrl(`${userId}/avatar.webp`).data.publicUrl
		: undefined;
};

export default getAvatar;
