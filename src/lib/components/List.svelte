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
		<i class="list__empty-message">{emptyMessage}</i>
	{:else}
		{#each items as item}
			{@render itemSnippet(item)}
		{/each}
	{/if}
</div>

<style>
	.list__empty-message {
		color: var(--text-medium);
		font-size: 0.8rem;
		text-align: center;
		display: block;
		margin: var(--base-spacing) auto;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: var(--base-spacing);
	}
</style>
