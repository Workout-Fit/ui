<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { type Events, type Props, buttonVariants } from './index.js';
	import { cn } from '$lib/utils.js';
	import { ProgressIndicator } from '../progress-indicator';

	type $$Props = Props;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let loading: $$Props['loading'] = false;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = variant === 'default' ? 'default' : 'auto';
	export let builders: $$Props['builders'] = [];
	export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size: size, className }))}
	{...$$restProps}
	on:click
	on:keydown
>
	{#if loading}<ProgressIndicator class="mx-auto" />{:else}<slot />{/if}
</ButtonPrimitive.Root>
