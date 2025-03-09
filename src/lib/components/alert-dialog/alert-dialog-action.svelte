<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
	import { buttonVariants } from '$lib/components/button';
	import { cn } from '$lib/utils.js';
	import { ProgressIndicator } from '../progress-indicator';

	let {
		class: className,
		ref = $bindable(null),
		loading,
		children,
		disabled,
		...restProps
	}: AlertDialogPrimitive.ActionProps & { loading?: boolean } = $props();
</script>

<AlertDialogPrimitive.Action
	bind:ref
	disabled={disabled || loading}
	class={cn(buttonVariants(), className)}
	{...restProps}
>
	{#if loading}<ProgressIndicator />{:else}{@render children?.()}{/if}
</AlertDialogPrimitive.Action>
