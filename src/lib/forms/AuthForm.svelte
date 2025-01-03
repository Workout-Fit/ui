<!--eslint-disable @typescript-eslint/no-explicit-any-->
<script lang="ts" module>
	import {
		superForm,
		type FormOptions,
		type SuperForm,
		type SuperValidated
	} from 'sveltekit-superforms/client';
	import { z, type ZodObject, type ZodTypeAny } from 'zod';

	export const authFormSchema = z.object({
		email: z.string().email(),
		password: z.string().min(8).max(50)
	});

	export type AuthFormProps<
		Schema extends ZodObject<Record<string, ZodTypeAny>> = typeof authFormSchema
	> = {
		action?: string;
		form: SuperValidated<z.TypeOf<Schema>>;
		extraFields?: Snippet<[form: SuperForm<z.TypeOf<Schema>>]>;
		submitLabel: string;
		enctype?: HTMLFormAttributes['enctype'];
		schema?: Schema;
	} & Omit<FormOptions<z.TypeOf<Schema>>, 'validators' | 'dataType'>;
</script>

<script lang="ts" generics="Schema extends ZodObject<Record<string, ZodTypeAny>>">
	import InputField from '$lib/components/InputField.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';

	let {
		form: formData,
		submitLabel,
		extraFields,
		enctype,
		schema,
		action,
		...rest
	}: AuthFormProps<Schema> = $props();

	const form = superForm(formData, {
		validators: zodClient(schema ?? authFormSchema),
		...rest
	});

	const { enhance } = form;

	let passwordFieldType = $state<'password' | 'text'>('password');
</script>

<form method="POST" {action} {enctype} use:enhance>
	<InputField
		label="E-mail"
		field={'email' as any}
		placeholder="johndoe@email.com"
		{form}
		type="email"
	/>
	<InputField label="Password" field={'password' as any} {form} type={passwordFieldType}>
		{#snippet decoration()}
			<button
				class="button--text"
				type="button"
				onclick={() => (passwordFieldType = passwordFieldType === 'password' ? 'text' : 'password')}
			>
				<small>
					{#if passwordFieldType === 'password'}Show{:else}Hide{/if}
				</small>
			</button>
		{/snippet}
	</InputField>
	{#if extraFields}{@render extraFields(form)}{/if}
	<button type="submit">{submitLabel}</button>
</form>

<style>
	form {
		display: flex;
		gap: var(--base-spacing);
		flex-direction: column;
	}
</style>
