import { error, fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { authFormSchema } from '$lib/forms/AuthForm.svelte';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signUpFormSchema } from './+page.svelte';
import insertProfile from '$lib/supabase/queries/insertProfile';
import pick from 'lodash/pick';

export const load = async () => ({
	signUpForm: await superValidate(zod(signUpFormSchema)),
	signInForm: await superValidate(zod(authFormSchema))
});

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(signUpFormSchema));
		if (!form.valid) return fail(400, { form });

		const { error: accountError, data } = await supabase.auth.signUp(
			pick(form.data, ['email', 'password'])
		);

		const [userResponse, avatarResponse] = await insertProfile(supabase, {
			...pick(form.data, ['username', 'full_name', 'bio']),
			user_id: data.user?.id as string
		});

		if (accountError || userResponse.error || avatarResponse?.error) {
			console.error(accountError ?? userResponse.error ?? avatarResponse?.error);
			return error(500, 'Failed to create account');
		} else redirect(303, '/');
	},
	signin: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(authFormSchema));
		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.auth.signInWithPassword(form.data);
		if (error) {
			console.error(error);
			redirect(303, '/auth/error');
		} else redirect(303, '/');
	}
};
