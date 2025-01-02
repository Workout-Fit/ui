<script lang="ts" module>
	import { z } from 'zod';
	import type { FormOptions, SuperValidated } from 'sveltekit-superforms/client';

	export type ExerciseFormProps = {
		oncancel: () => void;
		action?: string;
		form: SuperValidated<z.infer<typeof exerciseFormSchema>>;
	} & Omit<FormOptions<z.infer<typeof exerciseFormSchema>>, 'validators' | 'dataType'>;

	export const exerciseFormSchema = z.object({
		exercise: z
			.object({ id: z.string(), name: z.string() }, { message: 'Exercise is required' })
			.default(null as unknown as { id: string; name: string }),
		sets: z
			.number()
			.int()
			.default(null as unknown as number),
		repetitions: z
			.number()
			.int()
			.default(null as unknown as number),
		rest: z
			.number()
			.int()
			.default(null as unknown as number),
		notes: z.string().nullable()
	});
</script>

<script lang="ts">
	import Autocomplete from '$lib/components/Autocomplete.svelte';
	import FormActions from '$lib/components/FormActions.svelte';
	import type { Database } from '$lib/supabase/database.types';
	import InputField from '$lib/components/InputField.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';

	let { form: formData, oncancel, action, ...rest }: ExerciseFormProps = $props();

	const loadExercises = async (query: string) => {
		const response = await fetch(`/api/exercises?query=${query}`);
		return await response.json();
	};

	const _form = superForm(formData, {
		validators: zodClient(exerciseFormSchema),
		dataType: 'json',
		...rest
	});

	const { form, errors, enhance } = _form;
</script>

{#snippet exerciseAutocompleteEntry(item: Database['public']['Tables']['exercises']['Row'])}
	{item.name}
{/snippet}

<form class="exercise-form" {action} method="POST" use:enhance>
	<Autocomplete
		id="exercise"
		loadFunction={loadExercises}
		name="exercise"
		label="Exercise"
		debounceValue={300}
		searchThreshold={3}
		renderValue={exerciseAutocompleteEntry}
		bind:value={$form.exercise as Database['public']['Tables']['exercises']['Row']}
		error={$errors.exercise?._errors?.[0]}
		renderItem={exerciseAutocompleteEntry}
	/>
	<div>
		<InputField type="number" label="Sets" field="sets" placeholder="4" form={_form} />
		<InputField
			type="number"
			label="Repetitions"
			field="repetitions"
			placeholder="12"
			form={_form}
		/>
		<InputField type="number" label="Rest" field="rest" placeholder="60" form={_form} />
	</div>
	<InputField multiline field="notes" label="Notes" placeholder="Slow execution" form={_form} />

	<FormActions {oncancel} />
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: var(--base-spacing);
		min-width: 300px;
	}

	form > div {
		display: flex;
		width: 100%;
		gap: var(--base-spacing);
	}

	.exercise-form :global(.form-actions) {
		margin-left: auto;
	}
</style>
