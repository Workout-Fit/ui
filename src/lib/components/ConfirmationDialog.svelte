<script lang="ts" module>
	export type DialogProps = {
		cancelLabel?: string;
		confirmLabel: string;
		disabled?: boolean;
		message: string;
		title: string;
		open: boolean;
		onconfirm: () => void;
		oncancel: () => void;
	};
</script>

<script lang="ts">
	import Dialog from '$lib/components/Dialog.svelte';
	import { Button } from './ui/button';
	import * as m from '$lib/paraglide/messages';

	let {
		open,
		title,
		onconfirm,
		cancelLabel = m.cancel(),
		confirmLabel,
		message,
		disabled,
		oncancel
	}: DialogProps = $props();
</script>

<Dialog {open} onclose={oncancel}>
	<div class="confirmation-dialog">
		<h4>{title}</h4>
		<p>{message}</p>
		<div class="confirmation-dialog__actions">
			<Button type="button" {disabled} onclick={oncancel} variant="link">{cancelLabel}</Button>
			<Button type="button" {disabled} onclick={onconfirm}>{confirmLabel}</Button>
		</div>
	</div>
</Dialog>

<style>
	.confirmation-dialog {
		display: flex;
		flex-direction: column;
		gap: calc(2 * var(--base-spacing));
		padding: calc(2 * var(--base-spacing));
	}

	.confirmation-dialog__actions {
		margin-left: auto;
		display: flex;
		gap: var(--base-spacing);
	}

	h4 {
		margin: 0;
	}
</style>
