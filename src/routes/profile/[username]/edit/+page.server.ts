import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import insertProfile from '$lib/supabase/queries/insertProfile';
import { getProfileByUsername } from '$lib/supabase/queries/getProfile';
import { profileFormSchema } from '$lib/forms/ProfileForm.svelte';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { SetNonNullable } from 'type-fest';
import omit from 'lodash/omit';
import { i18n } from '$lib/i18n';
import getAvatar from '$lib/supabase/queries/getAvatar';
import { z } from 'zod';

export const load = async ({ locals: { supabase, user }, params }) => {
	const profileResponse = await getProfileByUsername(supabase, params.username);
	if (!profileResponse.data || profileResponse.data.user_id !== user?.id)
		return redirect(307, i18n.resolveRoute('/'));

	const form = await superValidate(
		{
			...(profileResponse.data as SetNonNullable<typeof profileResponse.data>),
			avatar: await getAvatar(supabase, user.id)
		},
		zod(profileFormSchema.extend({ avatar: z.string().optional() }))
	);

	return { form };
};

export const actions = {
	default: async ({ locals: { supabase, user }, request }) => {
		const form = await superValidate(request, zod(profileFormSchema));
		if (!user) return error(401, 'Unauthorized');

		if (!form.valid) return fail(400, { form });

		const [userResponse, avatarResponse] = await insertProfile(
			supabase,
			{ user_id: user.id, ...omit(form.data, 'avatar') },
			form.data.avatar as File | undefined
		);

		if (userResponse.error || avatarResponse?.error) {
			console.error(userResponse.error ?? avatarResponse?.error);
			return error(500, 'Failed to update Profile');
		}

		return redirect(302, i18n.resolveRoute(`/profile/${form.data.username}`));
	}
} satisfies Actions;
