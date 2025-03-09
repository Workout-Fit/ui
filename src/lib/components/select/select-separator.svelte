<script lang="ts">
	import type { Separator as SeparatorPrimitive } from 'bits-ui';
	import { Separator } from '$lib/components/separator';
	import { cn } from '$lib/utils.js';

	let { class: className, ...restProps }: SeparatorPrimitive.RootProps = $props();
</script>

<Separator class={cn('-mx-1 my-1 h-px bg-muted', className)} {...restProps} />
