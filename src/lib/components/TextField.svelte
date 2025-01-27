<script lang="ts" module>
	export type TextFieldProps<Form extends Record<string, unknown>> = {
		label: string;
		form: SuperForm<Form>;
		field: FormPathLeaves<Form>;
		decoration?: Snippet;
		decorationPosition?: 'before' | 'after';
	} & (
		| ({
				multiline?: false;
		  } & Omit<SvelteHTMLElements['input'], 'form'>)
		| ({
				multiline: true;
		  } & Omit<SvelteHTMLElements['textarea'], 'form'>)
	);
</script>

<script lang="ts" generics="Form extends Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { formFieldProxy, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms/client';

	let {
		label,
		multiline,
		form,
		field,
		decorationPosition = 'after',
		decoration,
		id = field,
		...rest
	}: TextFieldProps<Form> = $props();

	const { value, errors, constraints } = formFieldProxy<Form, FormPathLeaves<Form>>(form, field);
</script>

<div class="text-field">
	<label for={id}>{label}</label>
	<div class="text-field__input">
		{#if decoration && decorationPosition === 'before'}{@render decoration()}{/if}
		{#if multiline}
			<textarea
				aria-invalid={$errors && $errors.length > 0 ? 'true' : undefined}
				bind:value={$value}
				required={false}
				name={field}
				{id}
				{...$constraints}
				{...rest as SvelteHTMLElements['textarea']}
			></textarea>
		{:else}
			<input
				aria-invalid={$errors && $errors.length > 0 ? 'true' : undefined}
				bind:value={$value}
				name={field}
				type={(rest as SvelteHTMLElements['input']).type ?? 'text'}
				{...$constraints}
				{id}
				required={false}
				{...rest as SvelteHTMLElements['input']}
			/>
		{/if}
		{#if decoration && decorationPosition === 'after'}{@render decoration()}{/if}
	</div>
	{#if $errors && $errors.length > 0}<small class="input-field__invalid">{$errors[0]}</small>{/if}
</div>

<style>
	.text-field {
		display: flex;
		flex-direction: column;
		gap: calc(0.5 * var(--base-spacing));
		min-width: 0;
		width: 100%;
	}

	input,
	textarea {
		border: none;
		background-color: transparent;
		font-size: medium;
		color: var(--text-high);
		size: 1rem;
		width: 100%;
	}

	:is(input, textarea):focus {
		outline: none;
	}

	textarea {
		resize: none;
		min-height: 100px;
	}

	.text-field__input {
		border-radius: 4px;
		background-color: var(--text-lowest);
		box-sizing: border-box;
		padding: var(--base-spacing);
		font-size: medium;
		color: var(--text-high);
		display: flex;
	}

	label {
		font-size: small;
	}

	.input-field__invalid {
		color: red;
		opacity: 0.87;
		font-size: small;
	}
</style>
