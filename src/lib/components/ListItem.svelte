<script lang="ts">
	import { cn } from '$lib/utils';
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

<svelte:element
	this={elementType}
	class={cn(
		'grid-rows-[auto 1fr auto] grid grid-cols-1 p-2 transition-all duration-300 ease-in-out',
		{ 'hover:bg-accent focus:bg-accent': Boolean(href || onclick) }
	)}
	{...elementType === 'a' ? { href } : {}}
	{onclick}
>
	<div>
		{#if leftDecoration}{@render leftDecoration()}{/if}
	</div>
	<div class="col-2 flex w-full flex-col gap-2">
		<b>{title}</b>
		{#if secondLine}<small class="whitespace-pre-line opacity-80">{secondLine}</small>{/if}
		{#if thirdLine}<small class="whitespace-pre-line opacity-80">{thirdLine}</small>{/if}
	</div>
	<div>
		{#if rightDecoration}{@render rightDecoration()}{/if}
	</div>
</svelte:element>
