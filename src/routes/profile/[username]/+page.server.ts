import type { PageServerLoad } from './$types';
import type { Profile } from '$lib/types';
import { error } from '@sveltejs/kit';
import { getProfileByUsername } from '$lib/supabase/queries/getProfile';

export const load: PageServerLoad = async ({
	locals: { supabase, safeGetSession },
	params: { username }
}) => {
	const { user } = await safeGetSession();

	const profileResponse = await getProfileByUsername(supabase, username);

	if (!profileResponse.data) return error(404, 'Profile not found');

	return {
		editable: profileResponse.data.user_id === user?.id,
		profile: <Partial<Profile>>{
			...profileResponse.data,
			created_at: undefined,
			user_id: undefined,
			avatar_url: supabase.storage
				.from('avatars')
				.getPublicUrl(`${profileResponse.data?.user_id}.webp`).data?.publicUrl
		}
	};
};
