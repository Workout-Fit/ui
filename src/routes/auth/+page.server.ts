import { error, fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { authFormSchema } from '$lib/forms/AuthForm.svelte';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signUpFormSchema } from './+page.svelte';
import insertProfile from '$lib/supabase/queries/insertProfile';
import pick from 'lodash/pick';
import type { AuthError } from '@supabase/supabase-js';
import { z } from 'zod';

export const load = async () => ({
	signUpForm: await superValidate(zod(signUpFormSchema)),
	signInForm: await superValidate(zod(authFormSchema))
});

export const actions: Actions = {
	signup: async ({ request, locals: { supabase }, url }) => {
		const form = await superValidate(request, zod(signUpFormSchema));
		const next = url.searchParams.get('next') ?? '/';
		if (!form.valid) return fail(400, { form });

		const { error: accountError, data } = await supabase.auth.signUp(
			pick(form.data, ['email', 'password'])
		);

		const [userResponse, avatarResponse] = await insertProfile(supabase, {
			...pick(form.data, ['username', 'full_name', 'bio']),
			user_id: data.user?.id as string
		});

		const signUpError = [userResponse.error, avatarResponse?.error, accountError].find(Boolean);

		if (signUpError) {
			console.error(signUpError);
			return error(
				(signUpError as AuthError).status ?? 500,
				signUpError.message ?? 'Failed to sign-up'
			);
		} else redirect(303, next);
	},
	signin: async ({ request, locals: { supabase }, url }) => {
		const form = await superValidate(
			request,
			zod(z.object({ ...authFormSchema.shape, password: z.string().nonempty() }))
		);
		const next = url.searchParams.get('next') ?? '/';
		if (!form.valid) return fail(400, { form });

		const { error: signInError } = await supabase.auth.signInWithPassword(form.data);
		if (signInError)
			return error(signInError.status ?? 500, signInError.message ?? 'Failed to sign-in');
		else redirect(303, next);
	},
	forgot: async ({ request, locals: { supabase }, url }) => {
		const form = await superValidate(request, zod(authFormSchema));
		if (!form.valid) return fail(400, { form });

		const { error: forgotError } = await supabase.auth.resetPasswordForEmail(form.data.email, {
			redirectTo: `${url.origin}/auth/reset?email=${form.data.email}`
		});
		if (forgotError)
			return error(forgotError.status ?? 500, forgotError.message ?? 'Failed to send reset email');
		else return message(form, 'Email sent');
	}
};
