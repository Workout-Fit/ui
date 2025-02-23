<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		class: className,
		level = 'h3',
		children,
		...restProps
	}: AlertDialogPrimitive.TitleProps = $props();
</script>

<AlertDialogPrimitive.Title class={cn('text-lg font-semibold', className)} {level} {...restProps}>
	{@render children?.()}
</AlertDialogPrimitive.Title>
