<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import Button from './Button.svelte';
	import { getContext } from 'svelte';

	const { needRefresh, updateServiceWorker } =
		getContext<ReturnType<typeof useRegisterSW>>('service-worker');
</script>

<div class="update-toast" role="alert">
	New content available, click on reload button to update.
	<div class="update-toast__actions">
		<Button
			type="button"
			size="small"
			variant="text"
			onclick={() => {
				needRefresh.set(false);
			}}
		>
			Dismiss
		</Button>
		<Button
			type="button"
			size="small"
			onclick={() => {
				updateServiceWorker(true);
				needRefresh.set(false);
			}}
		>
			Reload
		</Button>
	</div>
</div>

<style>
	.update-toast {
		flex-direction: column;
		gap: var(--base-spacing);
		align-items: center;
		justify-content: center;
		display: flex;
		font-size: small;
	}

	:global(.update-toast-container) {
		display: flex;
		flex-direction: column-reverse;
		gap: var(--base-spacing);
		align-items: flex-end;
		justify-content: center;
		padding: var(--base-spacing);
		background-color: var(--color-background-secondary);
	}

	.update-toast__actions {
		display: flex;
		gap: var(--base-spacing);
		margin-left: auto;
	}
</style>
