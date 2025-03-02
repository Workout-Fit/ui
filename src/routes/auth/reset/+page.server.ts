import { error, fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import type { Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetFormSchema } from './+page.svelte';
import { i18n } from '$lib/i18n';
import * as m from '$lib/paraglide/messages';

export const load = async () => ({
	form: await superValidate(zod(resetFormSchema))
});

export const actions: Actions = {
	default: async ({ request, locals: { supabase }, cookies }) => {
		const form = await superValidate(request, zod(resetFormSchema));
		if (!form.valid) return fail(400, { form });

		const { error: resetError } = await supabase.auth.updateUser({
			password: form.data.password
		});

		if (resetError)
			return error(resetError.status ?? 500, resetError.message ?? m.password_reset_error());
		else
			return redirect(
				i18n.resolveRoute('/'),
				{ text: m.password_reset_success(), type: 'success' },
				cookies
			);
	}
};
