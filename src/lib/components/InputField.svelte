<script lang="ts" generics="Form extends Record<string, unknown>">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { formFieldProxy, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms/client';

	type InputFieldProps = {
		label: string;
		form: SuperForm<Form>;
		field: FormPathLeaves<Form, unknown>;
	} & (
		| ({
				multiline?: false;
		  } & Omit<SvelteHTMLElements['input'], 'form'>)
		| ({
				multiline: true;
		  } & Omit<SvelteHTMLElements['textarea'], 'form'>)
	);

	let { label, multiline, form, field, ...rest }: InputFieldProps = $props();

	const { value, errors, constraints } = formFieldProxy<Form, FormPathLeaves<Form>>(form, field);
</script>

<div class="input-field">
	<label for="name">{label}</label>
	{#if multiline}
		<textarea
			aria-invalid={$errors && $errors.length > 0 ? 'true' : undefined}
			bind:value={$value}
			required={false}
			{...$constraints}
			{...rest as SvelteHTMLElements['textarea']}
		></textarea>
	{:else}
		<input
			aria-invalid={$errors && $errors.length > 0 ? 'true' : undefined}
			bind:value={$value}
			type={(rest as SvelteHTMLElements['input']).type ?? 'text'}
			{...$constraints}
			required={false}
			{...rest as SvelteHTMLElements['input']}
		/>
	{/if}
	{#if $errors && $errors.length > 0}<small class="input-field__invalid">{$errors[0]}</small>{/if}
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
