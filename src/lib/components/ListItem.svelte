<script lang="ts">
	import { type Snippet } from 'svelte';

	type ListItemProps = {
		title: string;
		secondLine?: string;
		thirdLine?: string;
		leftDecoration?: Snippet;
		rightDecoration?: Snippet;
		onclick?: () => void;
		href?: string;
	};

	let {
		title,
		secondLine,
		thirdLine,
		onclick,
		href,
		leftDecoration,
		rightDecoration
	}: ListItemProps = $props();

	const elementType = href !== undefined ? 'a' : 'div';
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
	this={elementType}
	class="list-item"
	{...elementType === 'a' ? { href } : {}}
	{onclick}
>
	<div class="list-item__left-decoration">
		{#if leftDecoration}{@render leftDecoration()}{/if}
	</div>
	<div class="list-item__content">
		<span class="list-item__title">{title}</span>
		{#if secondLine}<small class="list-item__second-line">{secondLine}</small>{/if}
		{#if thirdLine}<small class="list-item__third-line">{thirdLine}</small>{/if}
	</div>
	<div class="list-item__right-decoration">
		{#if rightDecoration}{@render rightDecoration()}{/if}
	</div>
</svelte:element>

<style>
	.list-item {
		display: grid;
		grid-template: 1fr / auto 1fr auto;
		padding: var(--base-spacing);
		transition: background-color 0.3s ease-in-out;
	}

	.list-item:is(:hover, :focus) {
		background-color: var(--text-low);
	}

	a.list-item {
		text-decoration: none;
		color: inherit;
	}

	.list-item__content {
		grid-column: 2;
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-spacing) / 2);
		width: 100%;
	}

	.list-item__title {
		font-weight: 700;
	}

	.list-item__second-line,
	.list-item__third-line {
		color: var(--text-medium);
	}
</style>
