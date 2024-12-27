<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props =
		| ({
				label: string;
				errors?: string[];
				constraints?: Record<string, unknown>;
				multiline?: false;
		  } & SvelteHTMLElements['input'])
		| ({
				label: string;
				errors?: string[];
				constraints?: Record<string, unknown>;
				multiline: true;
		  } & SvelteHTMLElements['textarea']);

	let { label, errors, multiline, constraints, value = $bindable(), ...rest }: Props = $props();
</script>

<div class="input-field">
	<label for="name">{label}</label>
	{#if multiline}
		<textarea
			aria-invalid={errors && errors.length > 0 ? 'true' : undefined}
			bind:value
			required={false}
			{...constraints}
			{...rest as SvelteHTMLElements['textarea']}
		></textarea>
	{:else}
		<input
			aria-invalid={errors && errors.length > 0 ? 'true' : undefined}
			bind:value
			type={(rest as SvelteHTMLElements['input']).type ?? 'text'}
			{...constraints}
			required={false}
			{...rest as SvelteHTMLElements['input']}
		/>
	{/if}
	{#if errors && errors.length > 0}<small class="input-field__invalid">{errors[0]}</small>{/if}
</div>

<style>
	.input-field {
		display: flex;
		flex-direction: column;
		gap: calc(0.5 * var(--base-spacing));
		min-width: 0;
		width: 100%;
	}

	.input-field__invalid {
		color: red;
		font-size: 0.7rem;
		opacity: 0.8;
	}
</style>
