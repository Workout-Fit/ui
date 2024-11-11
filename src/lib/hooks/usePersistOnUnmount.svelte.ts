import { browser } from '$app/environment';
import { onMount } from 'svelte';

const usePersistOnUnmount = <T>(key: string, enabled: boolean, data: T) => {
	const saveFormData = () => localStorage.setItem(key, JSON.stringify(data));

	onMount(() => {
		if (browser) window.addEventListener('beforeunload', saveFormData);

		return () => {
			if (!enabled) return;

			saveFormData();
			if (browser) window.removeEventListener('beforeunload', saveFormData);
		};
	});

	$effect(() => {
		if (enabled) window.addEventListener('beforeunload', saveFormData);
		else window.removeEventListener('beforeunload', saveFormData);
	});
};

export default usePersistOnUnmount;
