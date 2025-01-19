<script lang="ts">
	import Button from './Button.svelte';
	import * as m from '$lib/paraglide/messages';

	let {
		oncancel,
		saveLabel = m.save(),
		cancelLabel = m.cancel(),
		loading = false,
		disabled = false
	}: {
		oncancel: () => void;
		saveLabel?: string;
		cancelLabel?: string;
		disabled?: boolean;
		loading?: boolean;
	} = $props();
</script>

<div class="form-actions">
	<Button {disabled} type="button" onclick={oncancel} variant="text">{cancelLabel}</Button>
	<Button {disabled} {loading} type="submit">{saveLabel}</Button>
</div>

<style>
	.form-actions {
		display: flex;
		gap: var(--base-spacing);
	}
</style>
