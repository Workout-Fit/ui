<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		class: className,
		src,
		alt,
		// @ts-expect-error: ref actually exists.
		ref = $bindable(null),
		...restProps
	}: AvatarPrimitive.ImageProps = $props();
</script>

<AvatarPrimitive.Image
	bind:ref
	{src}
	{alt}
	class={cn('aspect-square size-full', className)}
	{...restProps as any}
/>
