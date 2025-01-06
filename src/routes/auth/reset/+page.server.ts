import { error, fail } from '@sveltejs/kit';

import type { Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetFormSchema } from './+page.svelte';

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
		else return message(form, 'Password reset successfully');
	}
};
