<script lang="ts">
	import Button from './Button.svelte';

	let {
		oncancel,
		saveLabel = 'Save',
		cancelLabel = 'Cancel',
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
