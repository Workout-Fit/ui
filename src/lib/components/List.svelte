<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type ListProps<T> = {
		items?: T[];
		emptyMessage?: string;
		item: Snippet<[item: T]>;
	};
</script>

<script lang="ts" generics="T">
	let {
		items = [],
		emptyMessage = 'No items available',
		item: itemSnippet
	}: ListProps<T> = $props();
</script>

<div class="list">
	{#if items.length === 0}
		<i>{emptyMessage}</i>
	{:else}
		{#each items as item}
			{@render itemSnippet(item)}
		{/each}
	{/if}
</div>
