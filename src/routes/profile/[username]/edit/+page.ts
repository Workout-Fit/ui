import { profileFormSchema } from '$lib/forms/ProfileForm.svelte';
import { getFileFromURL } from '$lib/utils/file';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ parent, data, fetch }) => {
	await parent();
	const schema = zod(profileFormSchema);

	return {
		...data,
		form: {
			...data.form,
			data: {
				...data.form.data,
				avatar: data.form.data.avatar
					? await getFileFromURL(data.form.data.avatar, fetch)
					: undefined
			}
		}
	};
};
