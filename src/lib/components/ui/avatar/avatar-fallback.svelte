<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		class: className,
		// @ts-expect-error: ref actually exists.
		ref = $bindable(null),
		...restProps
	}: AvatarPrimitive.FallbackProps = $props();
</script>

<AvatarPrimitive.Fallback
	bind:ref
	class={cn('flex size-full items-center justify-center bg-muted', className)}
	{...restProps as any}
/>
