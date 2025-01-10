<script lang="ts" module>
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export type ButtonProps = HTMLButtonAttributes & {
		variant?: 'primary' | 'text';
		loading?: boolean;
	};
</script>

<script lang="ts">
	import CircularProgress from './CircularProgress.svelte';

	const {
		variant = 'primary',
		disabled,
		children,
		loading = false,
		...rest
	}: ButtonProps = $props();
</script>

<button disabled={disabled ?? loading} class={`button--${variant}`} {...rest}>
	{@render children()}
	{#if loading}<CircularProgress color="white" />{/if}
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
	}

	button:hover:disabled {
		cursor: wait;
	}

	button:hover {
		cursor: pointer;
	}

	button.button--primary {
		background-color: var(--color-primary);
		color: #fff;
	}

	button.button--text {
		color: var(--color-primary);
		background-color: transparent;
	}
</style>
