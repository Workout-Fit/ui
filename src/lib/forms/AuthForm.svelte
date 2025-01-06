<!--eslint-disable @typescript-eslint/no-explicit-any-->
<script lang="ts" module>
	export const authFormSchema = z.object({
		email: z.string().nonempty().email(),
		password: z.string()
	});

	export type AuthFormProps<
		Schema extends ZodObject<Record<string, ZodTypeAny>> = typeof authFormSchema
	> = {
		action?: string;
		data: SuperValidated<z.TypeOf<Schema>>;
		extraFields?: Snippet<[form: SuperForm<z.TypeOf<Schema>>]>;
		submitLabel: string;
		enctype?: HTMLFormAttributes['enctype'];
		schema?: Schema;
	} & Omit<FormOptions<z.TypeOf<Schema>>, 'validators'>;
</script>

<script lang="ts" generics="Schema extends ZodObject<Record<string, ZodTypeAny>>">
	import InputField from '$lib/components/InputField.svelte';
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

	const {
		data,
		submitLabel,
		extraFields,
		enctype,
		schema,
		action,
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

	const { enhance } = form;
</script>

<form method="POST" {action} {enctype} use:enhance>
	<InputField
		label="E-mail"
		field={'email' as any}
		placeholder="johndoe@email.com"
		{form}
		type="email"
	/>
	<PasswordField label="Password" placeholder="********" field={'password' as any} {form} />
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
