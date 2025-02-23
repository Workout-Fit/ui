<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type ListProps<T> = {
		items?: T[];
		emptyMessage?: string;
		item: Snippet<[item: T, index: number]>;
	};
</script>

<script lang="ts" generics="T">
	let {
		items = [],
		emptyMessage = 'No items available',
		item: itemSnippet
	}: ListProps<T> = $props();
</script>

<div class="flex flex-col gap-2">
	{#if items.length === 0}
		<i class="mx-auto my-2 block text-center text-sm opacity-70">{emptyMessage}</i>
	{:else}
		{#each items as item, index}
			{@render itemSnippet(item, index)}
		{/each}
	{/if}
</div>
