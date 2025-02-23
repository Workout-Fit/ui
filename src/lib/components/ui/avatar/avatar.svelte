<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		class: className,
		// @ts-expect-error: ref actually exists.
		ref = $bindable(null),
		loadingStatus = $bindable('loading'),
		children,
		...restProps
	}: AvatarPrimitive.Props = $props();
</script>

<AvatarPrimitive.Root
	bind:loadingStatus
	bind:ref
	class={cn('relative flex size-10 shrink-0 overflow-hidden rounded-full', className)}
	{...restProps as any}
>
	{@render children?.()}
</AvatarPrimitive.Root>
