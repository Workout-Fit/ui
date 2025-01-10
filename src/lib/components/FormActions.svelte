<script lang="ts">
	import Button from './Button.svelte';

	let {
		oncancel,
		saveLabel = 'Save',
		cancelLabel = 'Cancel',
		disabled = false
	}: {
		oncancel: () => void;
		saveLabel?: string;
		cancelLabel?: string;
		disabled?: boolean;
	} = $props();
</script>

<div class="form-actions">
	<Button {disabled} type="reset" onclick={oncancel} variant="text">{cancelLabel}</Button>
	<Button {disabled} type="submit">{saveLabel}</Button>
</div>

<style>
	.form-actions {
		display: flex;
		gap: var(--base-spacing);
	}
</style>
