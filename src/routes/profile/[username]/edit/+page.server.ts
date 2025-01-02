import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import insertProfile from '$lib/supabase/queries/insertProfile';
import { getProfileByUsername } from '$lib/supabase/queries/getProfile';
import { profileFormSchema } from '$lib/forms/ProfileForm.svelte';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import omit from 'lodash.omit';
import { exerciseFormSchema } from '$lib/forms/ExerciseForm.svelte';

export const load = async ({ locals: { supabase, user }, params }) => {
	const profileResponse = await getProfileByUsername(supabase, params.username);
	if (!profileResponse.data || profileResponse.data.user_id !== user?.id) return redirect(307, '/');

	const form = await superValidate(
		{
			...profileResponse.data,
			avatarUrl: supabase.storage.from('avatars').getPublicUrl(`${user.id}/avatar.webp`).data
				?.publicUrl
		},
		zod(profileFormSchema)
	);

	return { form };
};

export const actions = {
	default: async ({ locals: { supabase, user }, request }) => {
		const form = await superValidate(request, zod(profileFormSchema));
		if (!user) return error(401, 'Unauthorized');

		if (!form.valid)
			return fail(400, {
				form: {
					...form,
					data: {
						...form.data,
						avatarUrl:
							form.data.avatar ??
							supabase.storage.from('avatars').getPublicUrl(`${user.id}/avatar.webp`).data
								?.publicUrl
					}
				}
			});

		const [userResponse, avatarResponse] = await insertProfile(
			supabase,
			{ user_id: user.id, ...omit(form.data, 'avatar', 'avatarUrl') },
			form.data.avatar as File | undefined
		);

		if (userResponse.error || avatarResponse?.error) {
			console.error(userResponse.error ?? avatarResponse?.error);
			return error(500, 'Failed to update Profile');
		}

		return redirect(302, `/profile/${form.data.username}`);
	},
	exercise: async ({ request }) => {
		const form = await superValidate(request, zod(exerciseFormSchema));
		console.log({ form });
		if (!form.valid) return fail(400, { form });
		return { form };
	}
} satisfies Actions;
