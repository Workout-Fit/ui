<script lang="ts">
	import ChevronDown from '@material-symbols/svg-400/sharp/keyboard_arrow_down.svg?component';
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let { class: className, ...restProps }: SelectPrimitive.ScrollDownButtonProps = $props();
</script>

<SelectPrimitive.ScrollDownButton
	class={cn('flex cursor-default items-center justify-center py-1', className)}
	{...restProps}
>
	<ChevronDown class="size-4" />
</SelectPrimitive.ScrollDownButton>
