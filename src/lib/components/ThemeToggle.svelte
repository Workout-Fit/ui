<script lang="ts">
	import localStore from '$lib/stores/localStore.svelte';
	import Button from './Button.svelte';

	let { class: className = '' } = $props();
	let theme = localStore<'light' | 'dark'>('theme', 'light');

	const toggleTheme = () => theme?.set(theme.value === 'light' ? 'dark' : 'light');

	$effect(() => {
		if (typeof theme?.value === 'string') {
			document.documentElement.classList.remove('light', 'dark');
			document.documentElement.classList.add(theme.value);
		}
	});
</script>

<Button onclick={toggleTheme} variant="text">
	{theme?.value === 'dark' ? 'DARK' : 'LIGHT'}
</Button>
