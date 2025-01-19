import { error, fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetFormSchema } from './+page.svelte';
import { i18n } from '$lib/i18n';

export const load = async () => ({
	form: await superValidate(zod(resetFormSchema))
});

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		debugger;
		const form = await superValidate(request, zod(resetFormSchema));
		if (!form.valid) return fail(400, { form });

		const { error: resetError } = await supabase.auth.updateUser({
			password: form.data.password
		});

		if (resetError)
			return error(resetError.status ?? 500, resetError.message ?? 'Failed to reset password');
		else return redirect(302, i18n.resolveRoute('/'));
	}
};
