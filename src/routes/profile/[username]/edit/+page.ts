import { getFileFromURL } from '$lib/utils/file';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ parent, data, fetch }) => {
	await parent();

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
