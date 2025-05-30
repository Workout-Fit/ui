<script lang="ts" module>
	export type FormInputProps<Form extends Record<string, unknown>> = {
		label: string;
		form: SuperForm<Form>;
		field: FormPathLeaves<Form>;
	} & (
		| ({ multiline?: false } & Omit<HTMLInputAttributes, 'form' | 'name'>)
		| ({ multiline: true } & Omit<HTMLTextareaAttributes, 'form' | 'name'>)
	);
</script>

<script lang="ts" generics="Form extends Record<string, unknown>">
	import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
	import { formFieldProxy, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms/client';
	import { FormField, FormControl, FormLabel, FormDescription, FormFieldErrors } from '../form';
	import { Input } from '../input';
	import { Textarea } from '../textarea';

	let { label, form, field: name, multiline, ...rest }: FormInputProps<Form> = $props();

	const { value } = formFieldProxy<Form, FormPathLeaves<Form>>(form, name);
</script>

<FormField {form} {name}>
	<FormControl>
		{#snippet children({ props })}
			<FormLabel>{label}</FormLabel>
			{#if multiline}
				<Textarea {...rest as HTMLTextareaAttributes} {...props} bind:value={$value as string} />
			{:else}
				<Input {...rest as any} {...props} bind:value={$value} />
			{/if}
		{/snippet}
	</FormControl>
	<FormDescription />
	<FormFieldErrors />
</FormField>
