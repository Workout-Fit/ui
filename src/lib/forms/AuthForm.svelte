<!--eslint-disable @typescript-eslint/no-explicit-any-->
<script lang="ts" module>
	export const authFormSchema = z.object({
		email: z.string().nonempty().email(),
		password: z.string()
	});

	export type AuthFormProps<
		Schema extends ZodObject<Record<string, ZodTypeAny>> = typeof authFormSchema
	> = {
		data: SuperValidated<z.TypeOf<Schema>>;
		submitLabel: string;
		action?: string;
		extraFields?: Snippet<[form: SuperForm<z.TypeOf<Schema>>]>;
		passwordHTMLAutocomplete?: 'current-password' | 'new-password';
		enctype?: HTMLFormAttributes['enctype'];
		schema?: Schema;
	} & Omit<FormOptions<z.TypeOf<Schema>>, 'validators'>;
</script>

<script lang="ts" generics="Schema extends ZodObject<Record<string, ZodTypeAny>>">
	import TextField from '$lib/components/TextField.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import {
		superForm,
		type FormOptions,
		type SuperForm,
		type SuperValidated
	} from 'sveltekit-superforms/client';
	import { z, type ZodObject, type ZodTypeAny } from 'zod';
	import { showToast } from '$lib/utils/toast';
	import PasswordField from '$lib/components/PasswordField.svelte';
	import Button from '$lib/components/Button.svelte';

	let {
		data,
		submitLabel,
		extraFields,
		enctype,
		schema,
		action,
		passwordHTMLAutocomplete = 'current-password',
		id,
		...rest
	}: AuthFormProps<Schema> = $props();

	const form = superForm(data, {
		validators: zodClient(schema ?? authFormSchema),
		onError: ({ result }) => showToast('error', { text: result.error.message }),
		onUpdated: ({ form }) => {
			if (form.message) showToast('success', { text: form.message });
		},
		...rest
	});

	const { enhance, submitting } = form;
</script>

<form method="POST" {id} {action} {enctype} use:enhance>
	<TextField
		label="E-mail"
		field={'email' as any}
		placeholder="johndoe@email.com"
		autocomplete="email"
		disabled={$submitting}
		{form}
		type="email"
	/>
	<PasswordField
		disabled={$submitting}
		label="Password"
		placeholder="********"
		autocomplete={passwordHTMLAutocomplete}
		field={'password' as any}
		{form}
	/>
	{#if extraFields}{@render extraFields(form)}{/if}
	<Button loading={$submitting}>{submitLabel}</Button>
</form>

<style>
	form {
		display: flex;
		gap: var(--base-spacing);
		flex-direction: column;
	}
</style>
