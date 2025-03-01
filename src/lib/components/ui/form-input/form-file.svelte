<script lang="ts" module>
	export type FormFileInput<Form extends Record<string, unknown>> = {
		label: string;
		form: SuperForm<Form>;
		field: FormPathLeaves<Form>;
		files?: HTMLInputElement['files'];
	} & Omit<HTMLInputAttributes, 'form' | 'name' | 'type'>;
</script>

<script lang="ts" generics="Form extends Record<string, unknown>">
	import { fileFieldProxy, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms/client';
	import { FormField, FormControl, FormLabel, FormDescription, FormFieldErrors } from '../form';
	import { Input } from '../input';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		label,
		form,
		field: name,
		children: componentChildren,
		...rest
	}: FormFileInput<Form> = $props();

	const { value } = fileFieldProxy<Form, FormPathLeaves<Form>>(form, name);
</script>

<FormField {form} {name}>
	<FormControl>
		{#snippet children({ props })}
			<FormLabel>{label}</FormLabel>
			<div class="flex items-center gap-1">
				{@render componentChildren?.()}
				<Input {...rest} {...props} type="file" bind:files={$value as FileList} />
			</div>
		{/snippet}
	</FormControl>
	<FormDescription />
	<FormFieldErrors />
</FormField>
