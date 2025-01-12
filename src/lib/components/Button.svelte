<script lang="ts" module>
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export type ButtonProps = HTMLButtonAttributes & {
		variant?: 'primary' | 'text';
		loading?: boolean;
	};
</script>

<script lang="ts">
	import ProgressIndicator from './ProgressIndicator.svelte';

	const {
		variant = 'primary',
		disabled,
		children,
		loading = false,
		...rest
	}: ButtonProps = $props();
</script>

<button
	disabled={disabled ?? loading}
	class:button--text={variant === 'text'}
	class:button--primary={variant === 'primary'}
	{...rest}
>
	{#if loading}
		<ProgressIndicator color="white" />
	{:else}
		{@render children?.()}
	{/if}
</button>

<style>
	button {
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 500;
		text-transform: uppercase;
		text-decoration: none;
		font-size: 0.7rem;
		height: 32px;
		border-radius: calc(0.5 * var(--base-spacing));
		transition: all 0.3s ease-in-out;
	}

	button:hover:disabled {
		cursor: wait;
	}

	button:hover {
		cursor: pointer;
	}

	button.button--primary {
		background-color: var(--color-primary);
		padding: 0 var(--base-spacing);
		color: #fff;
	}

	button.button--text {
		color: var(--color-primary);
		background: transparent;
	}

	button.button--primary:focus {
		background-color: var(--color-primary-darker);
	}

	button.button--text:focus {
		color: var(--color-primary-darker);
	}
</style>
