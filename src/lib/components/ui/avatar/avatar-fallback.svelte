<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		class: className,
		// @ts-expect-error: ref actually exists.

		...restProps
	}: AvatarPrimitive.FallbackProps = $props();
</script>

<AvatarPrimitive.Fallback
	class={cn('flex size-full items-center justify-center bg-muted', className)}
	{...restProps as any}
/>
