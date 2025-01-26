<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';

	const { children, ...rest }: HTMLSelectAttributes = $props();
</script>

<select {...rest}>
	{@render children?.()}
</select>

<style>
	select {
		background: transparent;
		border: none;
		text-transform: uppercase;
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--color-primary);
		padding: 0;
	}
</style>
