<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import * as Select from './index.js';
	import { cn } from '$lib/utils.js';

	let {
		class: className,
		sideOffset = 4,
		children,
		...restProps
	}: SelectPrimitive.ContentProps = $props();
</script>

<SelectPrimitive.Content
	{sideOffset}
	class={cn(
		'relative z-50 max-h-96 min-w-10 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
		className
	)}
	{...restProps as any}
>
	<Select.ScrollUpButton />
	{@render children?.()}
	<Select.ScrollDownButton />
</SelectPrimitive.Content>
