<script lang="ts">
	import '$lib/theme/index.css';

	import { invalidate } from '$app/navigation';
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Header from '$lib/layouts/Header.svelte';
	import { browser } from '$app/environment';
	import { ProgressBar } from '@prgm/sveltekit-progress-bar';
	import { pwaInfo } from 'virtual:pwa-info';

	import 'toastify-js/src/toastify.css';
	import { on } from 'svelte/events';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	let { session, supabase } = data;

	onMount(() => {
		let formEventHandlerRemove: () => void;
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) invalidate('supabase:auth');
		});

		if (browser)
			formEventHandlerRemove = on(document, 'keydown', (e: KeyboardEvent) => {
				if (!(e.key === 'Enter' && (e.metaKey || e.ctrlKey)) || !e.target) return;

				if ('form' in e.target) {
					const formElement = e.target.form as HTMLFormElement;
					formElement?.requestSubmit();
				}
			});

		return () => {
			data.subscription.unsubscribe();
			formEventHandlerRemove();
		};
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html pwaInfo?.webManifest?.linkTag ?? ''}
</svelte:head>

<ProgressBar color="var(--color-primary);" />

<div>
	<Header username={data.username} />
	{@render children()}
</div>

<style>
	div {
		padding: calc(var(--base-spacing) * 2);
		max-width: 960px;
		margin: auto;
		min-height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}
</style>
