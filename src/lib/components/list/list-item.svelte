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
	class={cn('flex items-center justify-between p-2 transition-all duration-300 ease-in-out', {
		'hover:bg-accent focus:bg-accent': Boolean(href || onclick)
	})}
	{...elementType === 'a' ? { href } : {}}
	{onclick}
>
	{#if leftDecoration}{@render leftDecoration()}{/if}
	<div class="flex flex-grow flex-col gap-1">
		<b>{title}</b>
		{#if secondLine}<small class="whitespace-pre-line opacity-80">{secondLine}</small>{/if}
		{#if thirdLine}<small class="whitespace-pre-line opacity-80">{thirdLine}</small>{/if}
	</div>
	{#if rightDecoration}{@render rightDecoration()}{/if}
</svelte:element>
