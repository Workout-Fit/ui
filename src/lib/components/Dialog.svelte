<script lang="ts">
	import { type Snippet } from 'svelte';
	import { Button } from './ui/button';
	import * as m from '$lib/paraglide/messages';

	let {
		open = $bindable(),
		children,
		onclose
	}: { open: boolean; children?: Snippet; onclose?: () => void } = $props();

	let dialog: HTMLDialogElement;

	const handleClose = () => {
		open = false;
		onclose?.();
	};

	$effect(() => {
		if (open) dialog.showModal();
		else dialog.close();
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onmousedown={(event: MouseEvent) => {
		if (event.target === dialog) handleClose();
	}}
>
	<div class="dialog__content">
		<Button type="button" style="margin-left: auto;" onclick={handleClose} variant="link">
			{m.close()}
		</Button>
		{@render children?.()}
	</div>
</dialog>

<style>
	dialog {
		background: var(--color-background);
		color: var(--text-high);
		padding: 0;
	}

	.dialog__content {
		border: 0;
		display: flex;
		flex-direction: column;
		gap: var(--base-spacing);
	}

	::backdrop {
		background-color: var(--text-low);
	}

	dialog,
	::backdrop {
		transition:
			display 0.3s allow-discrete,
			overlay 0.3s allow-discrete,
			opacity 0.3s;
		opacity: 0;
	}

	[open],
	[open]::backdrop {
		opacity: 1;
	}

	dialog {
		border: 0;
	}

	@starting-style {
		[open],
		[open]::backdrop {
			opacity: 0;
		}
	}

	@media screen and (max-width: 768px) {
		dialog {
			width: 100%;
			max-width: unset;
			margin: 0;
			margin-top: auto;
			box-sizing: border-box;
		}
	}
</style>
