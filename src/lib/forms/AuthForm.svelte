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
		disabled?: boolean;
		schema?: Schema;
	} & Omit<FormOptions<z.TypeOf<Schema>>, 'validators'>;
</script>

<script lang="ts" generics="Schema extends ZodObject<Record<string, ZodTypeAny>>">
	import FormInput from '$lib/components/ui/form-input/form-input.svelte';
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
	import { Button } from '$lib/components/ui/button';
	import * as m from '$lib/paraglide/messages';

	let {
		data,
		submitLabel,
		extraFields,
		enctype,
		schema,
		action,
		passwordHTMLAutocomplete = 'current-password',
		id,
		disabled = false,
		...rest
	}: AuthFormProps<Schema> = $props();

	const form = superForm(data, {
		validators: zodClient(schema ?? authFormSchema),
		...rest
	});

	const { enhance, submitting } = form;
</script>

<form method="POST" class="flex flex-col gap-2" {id} {action} {enctype} use:enhance>
	<FormInput
		label={m.email()}
		field={'email' as any}
		placeholder="johndoe@email.com"
		autocomplete="email"
		disabled={$submitting || disabled}
		{form}
		type="email"
	/>
	<FormInput
		type="password"
		disabled={$submitting || disabled}
		label={m.password()}
		placeholder="********"
		autocomplete={passwordHTMLAutocomplete}
		field={'password' as any}
		{form}
	/>
	{#if extraFields}{@render extraFields(form)}{/if}
	<Button loading={$submitting || disabled}>{submitLabel}</Button>
</form>
