<script lang="ts">
	import { Button } from './ui/button';
	import * as m from '$lib/paraglide/messages';
	import { cn } from '$lib/utils';

	let {
		oncancel,
		class: className,
		saveLabel = m.save(),
		cancelLabel = m.cancel(),
		loading = false,
		disabled = false
	}: {
		class?: string;
		oncancel: () => void;
		saveLabel?: string;
		cancelLabel?: string;
		disabled?: boolean;
		loading?: boolean;
	} = $props();
</script>

<div class={cn('flex gap-4', className)}>
	<Button {disabled} onclick={oncancel} variant="secondary">{cancelLabel}</Button>
	<Button {disabled} {loading} type="submit">{saveLabel}</Button>
</div>
