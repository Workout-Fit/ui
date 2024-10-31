<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Header from '$lib/layouts/Header.svelte';
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

<Header />
<div>
	{@render children()}
</div>

<style>
	div {
		padding: calc(var(--base-spacing) * 2);
	}
</style>
