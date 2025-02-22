<script lang="ts" module>
	export type TextFieldProps<Form extends Record<string, unknown>> = {
		label: string;
		form: SuperForm<Form>;
		field: FormPathLeaves<Form>;
		multiline?: boolean;
	} & Omit<SvelteHTMLElements['input'], 'form' | 'name'>;
</script>

<script lang="ts" generics="Form extends Record<string, unknown>">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { formFieldProxy, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms/client';
	import { FormField, FormControl, FormLabel, FormDescription, FormFieldErrors } from '../form';
	import { Input } from '../input';
	import { Textarea } from '../textarea';

	let { label, form, field: name, type, multiline }: TextFieldProps<Form> = $props();

	const { value } = formFieldProxy<Form, FormPathLeaves<Form>>(form, name);
</script>

<FormField {form} {name}>
	<FormControl let:attrs>
		<FormLabel>{label}</FormLabel>
		{#if multiline}
			<Textarea {...attrs} bind:value={$value as string} />
		{:else}
			<Input {type} {...attrs} bind:value={$value} />
		{/if}
	</FormControl>
	<FormDescription />
	<FormFieldErrors />
</FormField>
