import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import type { WorkoutFormData } from './+page.svelte';

export const load: PageLoad = async () => {
	if (browser) {
		const initialValue = localStorage['new-workout'];
		console.log('initialValue', initialValue);
		return { initialValue: initialValue ? JSON.parse(initialValue) : undefined } as {
			initialValue: WorkoutFormData | undefined;
		};
	}
};
