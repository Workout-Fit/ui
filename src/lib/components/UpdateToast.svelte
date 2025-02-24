<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import { Button } from './ui/button';
	import { getContext } from 'svelte';

	const { needRefresh, updateServiceWorker } =
		getContext<ReturnType<typeof useRegisterSW>>('service-worker');
</script>

<div class="update-toast" role="alert">
	New content available, click on reload button to update.
	<div class="update-toast__actions">
		<Button
			size="sm"
			variant="link"
			onclick={() => {
				needRefresh.set(false);
			}}
		>
			Dismiss
		</Button>
		<Button
			size="sm"
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
