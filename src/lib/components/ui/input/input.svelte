<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	type Props = Omit<HTMLInputAttributes, 'type'> &
		(
			| { type: 'file'; files?: HTMLInputElement['files'] }
			| { type?: Exclude<HTMLInputTypeAttribute, 'file'>; files?: undefined }
		);

	let {
		class: className,
		value = $bindable(),
		files = $bindable(),
		type,
		...rest
	}: Props = $props();
</script>

{#if type === 'file'}
	<input
		class={cn(
			'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		type="file"
		bind:files
		{...rest}
	/>
{:else}
	<input
		class={cn(
			'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		{type}
		bind:value
		{...rest}
	/>
{/if}
