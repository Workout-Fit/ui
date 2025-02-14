<script lang="ts" module>
	import { z } from 'zod';
	import type { FormOptions, SuperForm, SuperValidated } from 'sveltekit-superforms/client';

	export type ExerciseFormProps = {
		oncancel: () => void;
		action?: string;
		data: SuperValidated<z.infer<typeof exerciseFormSchema>>;
		form?: SuperForm<z.infer<typeof exerciseFormSchema>>;
	} & Omit<FormOptions<z.infer<typeof exerciseFormSchema>>, 'validators' | 'dataType'>;

	export const exerciseFormSchema = z.object({
		exercise: z
			.object({
				id: z.string(),
				name: z.string()
			})
			.default(null as any),
		sets: z.array(z.number().int().min(1)).default([null] as any),
		repetitions: z.array(z.number().int().min(1)).default([null] as any),
		rests: z.array(z.number().int().min(1).nullable()).default([null] as any),
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
	import Button from '$lib/components/Button.svelte';

	let { data, oncancel, form = $bindable(), action, ...rest }: ExerciseFormProps = $props();
	form = superForm(data, {
		validators: zodClient(exerciseFormSchema),
		dataType: 'json',
		...rest
	});

	const loadExercises = async (query: string) => {
		const response = await fetch(i18n.resolveRoute(`/api/exercises?query=${query}`));
		return (await response.json()) as NonNullable<Awaited<ReturnType<typeof getExercises>>['data']>;
	};

	const { form: formData, submitting, errors, enhance, delayed } = form;

	const addSetGroup = () => {
		$formData.sets = [...($formData.sets ?? []), null as any];
		$formData.repetitions = [...($formData.repetitions ?? []), null as any];
		$formData.rests = [...$formData.rests, null];
	};

	const removeSetGroup = (index: number) => {
		$formData.sets = [...$formData.sets.slice(0, index), ...$formData.sets.slice(index + 1)];
		$formData.repetitions = [
			...$formData.repetitions.slice(0, index),
			...$formData.repetitions.slice(index + 1)
		];
		$formData.rests = [...$formData.rests.slice(0, index), ...$formData.rests.slice(index + 1)];
	};
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
		bind:value={$formData.exercise}
		error={$errors.exercise?._errors?.[0]}
		renderItem={exerciseAutocompleteEntry}
	/>
	{#each $formData.sets as _, index}
		<div>
			<TextField
				type="number"
				disabled={$submitting}
				label={m.sets()}
				field="sets[{index}]"
				placeholder="4"
				{form}
			/>
			<TextField
				type="number"
				label={m.repetitions()}
				field="repetitions[{index}]"
				placeholder="12"
				{form}
				disabled={$submitting}
			/>
			<TextField
				disabled={$submitting}
				type="number"
				label={m.rest()}
				field="rests[{index}]"
				placeholder="60"
				{form}
			/>
			{#if index + 1 === $formData.sets.length}
				<Button size="large" type="button" variant="text" onclick={addSetGroup}>+</Button>
			{:else}
				<Button size="large" type="button" variant="text" onclick={() => removeSetGroup(index)}>
					-
				</Button>
			{/if}
		</div>
	{/each}
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

	:global(form > div > button) {
		align-self: center;
	}

	.exercise-form :global(.form-actions) {
		margin-left: auto;
	}
</style>
