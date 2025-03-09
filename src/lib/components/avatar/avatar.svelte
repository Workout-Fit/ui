<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		class: className,
		loadingStatus = $bindable('loading'),
		children,
		...restProps
	}: AvatarPrimitive.RootProps = $props();
</script>

<AvatarPrimitive.Root
	bind:loadingStatus
	class={cn('relative flex size-10 shrink-0 overflow-hidden rounded-full', className)}
	{...restProps as any}
>
	{@render children?.()}
</AvatarPrimitive.Root>
