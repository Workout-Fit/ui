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
			.object({
				id: z.string(),
				name: z.string()
			})
			.default(null as any),
		sets: z
			.number()
			.int()
			.min(1)
			.default(null as any),
		repetitions: z
			.number()
			.int()
			.min(1)
			.default(null as any),
		rest: z
			.number()
			.int()
			.min(0)
			.default(null as any),
		notes: z.string().nullable()
	});
</script>

<script lang="ts">
	import Autocomplete from '$lib/components/Autocomplete.svelte';
	import FormActions from '$lib/components/FormActions.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import * as m from '$lib/paraglide/messages';
	import type { getExercises } from '$lib/supabase/queries/getExercises';
	import { i18n } from '$lib/i18n';

	let { form: formData, oncancel, action, ...rest }: ExerciseFormProps = $props();

	const loadExercises = async (query: string) => {
		const response = await fetch(i18n.resolveRoute(`/api/exercises?query=${query}`));
		return (await response.json()) as NonNullable<Awaited<ReturnType<typeof getExercises>>['data']>;
	};

	const form = superForm(formData, {
		validators: zodClient(exerciseFormSchema),
		dataType: 'json',
		...rest
	});

	const { form: data, submitting, errors, enhance, delayed } = form;
</script>

{#snippet exerciseAutocompleteEntry(
	item: NonNullable<Awaited<ReturnType<typeof getExercises>>['data']>[number]
)}
	{item.name}
{/snippet}

<form class="exercise-form" {action} method="POST" use:enhance>
	<Autocomplete
		id="exercise"
		loadFunction={loadExercises}
		name="exercise"
		label={m.exercise()}
		debounceValue={300}
		searchThreshold={3}
		disabled={$submitting}
		renderValue={exerciseAutocompleteEntry}
		bind:value={$data.exercise}
		error={$errors.exercise?._errors?.[0]}
		renderItem={exerciseAutocompleteEntry}
	/>
	<div>
		<TextField
			type="number"
			disabled={$submitting}
			label={m.sets()}
			field="sets"
			placeholder="4"
			{form}
		/>
		<TextField
			type="number"
			label={m.repetitions()}
			field="repetitions"
			placeholder="12"
			{form}
			disabled={$submitting}
		/>
		<TextField
			disabled={$submitting}
			type="number"
			label={m.rest()}
			field="rest"
			placeholder="60"
			{form}
		/>
	</div>
	<TextField
		disabled={$submitting}
		multiline
		field="notes"
		id="exercise-notes"
		label={m.notes()}
		placeholder={m.exercise_notes_placeholder()}
		{form}
	/>
	<FormActions disabled={$submitting} loading={$delayed} {oncancel} />
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
