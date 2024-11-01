<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Header from '$lib/layouts/Header.svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import '$lib/theme/index.css';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	let { session, supabase } = data;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) invalidate('supabase:auth');
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html pwaInfo?.webManifest?.linkTag ?? ''}
</svelte:head>

<Header />
<div>
	{@render children()}
</div>

<style>
	div {
		padding: calc(var(--base-spacing) * 2);
	}
</style>
