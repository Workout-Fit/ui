import { browser } from '$app/environment';
import { onMount } from 'svelte';

const usePersistOnUnmount = <T>(key: string, data: () => T) => {
	onMount(() => {
		const saveFormData = () => localStorage.setItem(key, JSON.stringify(data()));

		if (browser) window.addEventListener('beforeunload', saveFormData);

		return () => {
			saveFormData();
			if (browser) window.removeEventListener('beforeunload', saveFormData);
		};
	});
};

export default usePersistOnUnmount;
