<script lang="ts" module>
	import { z } from 'zod';
	import type { SuperForm } from 'sveltekit-superforms/client';

	export type ExerciseFormProps = {
		oncancel: () => void;
		form: SuperForm<z.infer<typeof exerciseFormSchema>>;
		action?: string;
	};

	export const exerciseFormSchema = z.object({
		id: z.number().optional(),
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
	import { Combobox } from '$lib/components/combobox';
	import { FormActions } from '$lib/components/form-actions';
	import { FormInput } from '$lib/components/form-input';
	import Add from '@material-symbols/svg-400/sharp/add.svg?component';
	import Remove from '@material-symbols/svg-400/sharp/remove.svg?component';
	import { m } from '$lib/paraglide/messages';
	import type { getExercises } from '$lib/supabase/queries/getExercises';
	import { Button } from '$lib/components/button';
	import { getLocale } from '$lib/paraglide/runtime';
	import { FormField } from '$lib/components/form';
	import { FormControl, FormDescription, FormFieldErrors } from '$lib/components/form';

	let { oncancel, form, action }: ExerciseFormProps = $props();

	const loadExercises = async (query: string) => {
		const searchParams = new URLSearchParams({ query, language: getLocale() });
		const response = await fetch('/api/exercises?' + searchParams.toString());
		return (await response.json()) as NonNullable<Awaited<ReturnType<typeof getExercises>>['data']>;
	};

	const { form: formData, submitting, enhance, delayed } = form;

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

<form class="flex flex-col" {action} method="POST" use:enhance>
	<FormField {form} name="exercise">
		<FormControl>
			<Combobox
				id="exercise"
				loadFunction={loadExercises}
				name="exercise"
				label={m.exercise()}
				debounceValue={300}
				searchThreshold={3}
				placeholder={m.exercise_search()}
				disabled={$submitting}
				getItemValue={({ id }) => id}
				getItemLabel={({ name }) => name}
				bind:value={$formData.exercise}
			/>
		</FormControl>
		<FormDescription />
		<FormFieldErrors />
	</FormField>
	{#each $formData.sets as _, index (index)}
		<div class="flex gap-2">
			<FormInput
				type="number"
				disabled={$submitting}
				label={m.sets()}
				field="sets[{index}]"
				placeholder="4"
				{form}
			/>
			<FormInput
				type="number"
				label={m.repetitions()}
				field="repetitions[{index}]"
				placeholder="12"
				{form}
				disabled={$submitting}
			/>
			<FormInput
				disabled={$submitting}
				type="number"
				label={m.rest()}
				field="rests[{index}]"
				placeholder="60"
				{form}
			/>
			{#if index + 1 === $formData.sets.length}
				<Button size="icon" variant="ghost" onclick={() => addSetGroup()} class="mt-8">
					<Add width={16} height={16} class="fill-primary" />
				</Button>
			{:else}
				<Button size="icon" variant="ghost" onclick={() => removeSetGroup(index)} class="mt-8">
					<Remove width={16} height={16} class="fill-primary" />
				</Button>
			{/if}
		</div>
	{/each}
	<FormInput
		disabled={$submitting}
		multiline
		field="notes"
		id="exercise-notes"
		label={m.notes()}
		placeholder={m.exercise_notes_placeholder()}
		{form}
	/>
	<FormActions disabled={$submitting} class="ml-auto" loading={$delayed} {oncancel} />
</form>
