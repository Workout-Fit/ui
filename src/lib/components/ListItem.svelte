<script lang="ts">
	import { type Snippet } from 'svelte';

	type ListItemProps = {
		title: string;
		subtitle: string | null;
		leftDecoration?: Snippet;
		rightDecoration?: Snippet;
		onclick?: () => void;
		href?: string;
	};

	let { title, subtitle, onclick, href, leftDecoration, rightDecoration }: ListItemProps = $props();

	const elementType = onclick !== undefined ? 'button' : href !== undefined ? 'a' : 'div';
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element this={elementType} {...elementType === 'a' ? { href } : {}} {onclick}>
	<div class="list-item">
		{#if leftDecoration}
			{@render leftDecoration()}
		{/if}
		<div class="list-item__content">
			<span class="list-item__title">{title}</span>
			{#if subtitle}<span class="list-item__subtitle">{subtitle}</span>{/if}
		</div>
		{#if rightDecoration}
			{@render rightDecoration()}
		{/if}
	</div>
</svelte:element>

<style>
	.list-item {
		display: grid;
		grid-template-columns: auto 1fr auto;
	}

	a.list-item {
		text-decoration: none;
		color: inherit;
	}

	button.list-item {
		border: none;
		background: none;
		cursor: pointer;
	}
</style>
