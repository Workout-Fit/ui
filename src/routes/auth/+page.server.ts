import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { authFormSchema } from '$lib/forms/AuthForm.svelte';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signUpFormSchema } from './+page.svelte';

export const load = async () => ({
	signUpForm: await superValidate(zod(signUpFormSchema)),
	signInForm: await superValidate(zod(authFormSchema))
});

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(signUpFormSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.auth.signUp(form.data);
		if (error) {
			console.error(error);
			redirect(303, '/auth/error');
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
