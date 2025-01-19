<script lang="ts">
	import localStore from '$lib/stores/localStore.svelte';
	import Button from './Button.svelte';
	import * as m from '$lib/paraglide/messages';

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
	{theme?.value === 'dark' ? m.dark() : m.light()}
</Button>
