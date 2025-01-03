import type { PageServerLoad } from './$types';
import type { Profile } from '$lib/types';
import { error } from '@sveltejs/kit';
import omit from 'lodash/omit';
import { getProfileByUsername } from '$lib/supabase/queries/getProfile';
import getWorkouts from '$lib/supabase/queries/getWorkouts';

export const load: PageServerLoad = async ({
	locals: { supabase, safeGetSession },
	params: { username }
}) => {
	const { user } = await safeGetSession();

	const profileResponse = await getProfileByUsername(supabase, username);

	if (!profileResponse.data) return error(404, 'Profile not found');

	return {
		editable: profileResponse.data.user_id === user?.id,
		workouts: (await getWorkouts(supabase, profileResponse.data.user_id)).data ?? [],
		profile: <Partial<Profile>>{
			...omit(profileResponse.data, 'created_at', 'user_id'),
			avatar_url: supabase.storage
				.from('avatars')
				.getPublicUrl(`${profileResponse.data?.user_id}/avatar.webp`).data?.publicUrl
		}
	};
};
