import { fail } from '@sveltejs/kit';

import type { Actions } from './$types';
import { authFormSchema } from '$lib/forms/AuthForm.svelte';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signUpFormSchema } from './+page.svelte';
import insertProfile from '$lib/supabase/queries/insertProfile';
import pick from 'lodash/pick';
import { z } from 'zod';
import * as m from '$lib/paraglide/messages';

export const load = async () => {
	const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
	const hashArray = Array.from(
		new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(nonce)))
	);
	const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

	return {
		nonce,
		hashedNonce,
		signUpForm: await superValidate(zod(signUpFormSchema)),
		signInForm: await superValidate(zod(authFormSchema))
	};
};

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(signUpFormSchema));
		if (!form.valid) return fail(400, { form });

		const { error: accountError, data } = await supabase.auth.signUp(
			pick(form.data, ['email', 'password'])
		);
		const [userResponse, avatarResponse] = await insertProfile(
			supabase,
			{
				...pick(form.data, ['username', 'full_name', 'bio', 'height', 'weight']),
				user_id: data.user?.id as string
			},
			form.data.avatar as File | undefined
		);

		const signUpError = [userResponse.error, avatarResponse?.error, accountError].find(Boolean);

		if (signUpError) {
			console.error(signUpError);
			return message(form, { text: signUpError.message ?? 'Failed to sign-up', type: 'error' });
		}
		return message(form, { text: m.sign_up_success(), type: 'success' });
	},
	signin: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(
			request,
			zod(z.object({ ...authFormSchema.shape, password: z.string().nonempty() }))
		);
		if (!form.valid) return fail(400, { form });

		const { error: signInError } = await supabase.auth.signInWithPassword(form.data);
		if (signInError) {
			console.error(signInError);
			return message(
				form,
				{ text: signInError.message ?? 'Failed to sign-in', type: 'error' },
				{ status: (signInError.status as any) ?? 500 }
			);
		}
		return { form };
	},
	forgot: async ({ request, locals: { supabase }, url }) => {
		const form = await superValidate(request, zod(authFormSchema));
		if (!form.valid) return fail(400, { form });

		const { error: forgotError } = await supabase.auth.resetPasswordForEmail(form.data.email, {
			redirectTo: `${url.origin}/auth/reset?email=${form.data.email}`
		});
		if (forgotError) {
			console.error(forgotError);
			return message(
				form,
				{ text: forgotError.message ?? 'Failed to send reset e-mail', type: 'error' },
				{ status: 500 }
			);
		}
		return message(form, { text: m.email_sent(), type: 'success' });
	}
};
