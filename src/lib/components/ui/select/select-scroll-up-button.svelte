<script lang="ts">
	import ChevronUp from '@material-symbols/svg-400/sharp/keyboard_arrow_up.svg?component';
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let { class: className, ...restProps }: SelectPrimitive.ScrollDownButtonProps = $props();
</script>

<SelectPrimitive.ScrollUpButton
	class={cn('flex cursor-default items-center justify-center py-1', className)}
	{...restProps}
>
	<ChevronUp class="size-4" />
</SelectPrimitive.ScrollUpButton>
