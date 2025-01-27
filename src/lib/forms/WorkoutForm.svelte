<script module lang="ts">
	import { z } from 'zod';
	import { type SuperValidated } from 'sveltekit-superforms';

	type WorkoutFormProps = {
		title: string;
		form: SuperValidated<z.infer<typeof workoutFormSchema>>;
		exerciseForm: SuperValidated<z.infer<typeof exerciseFormSchema>>;
	};

	export const workoutFormSchema = z.object({
		name: z.string().nonempty(),
		notes: z.string().nullable(),
		exercises: z.array(exerciseFormSchema)
	});
</script>

<script lang="ts">
	import { pushState, replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import ExerciseListItem from '$lib/components/ExerciseListItem.svelte';
	import type { WorkoutExercise } from '$lib/types';
	import ExerciseForm, { exerciseFormSchema } from './ExerciseForm.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import TextField from '$lib/components/TextField.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import Button from '$lib/components/Button.svelte';
	import List from '$lib/components/List.svelte';
	import * as m from '$lib/paraglide/messages';

	const handleCloseModal = () => replaceState('', { modalShown: undefined });

	let { title, form: formData, exerciseForm }: WorkoutFormProps = $props();

	const form = superForm(formData, {
		validators: zodClient(workoutFormSchema),
		dataType: 'json'
	});

	const { form: data, enhance, submitting, delayed } = form;
</script>

<form class="workout-form" action="?/workout" method="POST" use:enhance>
	<div class="workout-form__info">
		<div class="workout-form__title">
			<h2>{title}</h2>
			<Button type="submit" disabled={$submitting} loading={$delayed}>{m.save()}</Button>
		</div>

		<TextField
			label={m.name()}
			type="text"
			{form}
			disabled={$submitting}
			field="name"
			placeholder={m.workout_name_placeholder()}
		/>
		<TextField
			label={m.notes()}
			{form}
			disabled={$submitting}
			multiline
			field="notes"
			placeholder={m.workout_notes_placeholder()}
		/>
	</div>
	<div class="workout-form__exercise-list">
		<div class="workout-form__exercise-list-title">
			<h2>{m.exercises()}</h2>
			<Button
				variant="text"
				type="button"
				disabled={$submitting}
				onclick={() => pushState('', { modalShown: 'add-exercise' })}
			>
				+ {m.add_exercise()}
			</Button>
		</div>
		<List items={$data.exercises} emptyMessage="No exercises added">
			{#snippet item(exercise)}
				<ExerciseListItem {exercise}>
					{#snippet decoration()}
						<Button
							type="button"
							disabled={$submitting}
							onclick={() =>
								($data.exercises = $data.exercises?.filter((item) => item !== exercise) ?? [])}
							variant="text"
						>
							{m.remove()}
						</Button>
					{/snippet}
				</ExerciseListItem>
			{/snippet}
		</List>
	</div>
</form>

<Dialog open={page.state.modalShown === 'add-exercise'} onclose={handleCloseModal}>
	<div class="exercise-dialog">
		<h3>{m.add_exercise()}</h3>
		{#key $data.exercises.length}
			<ExerciseForm
				oncancel={handleCloseModal}
				form={exerciseForm}
				action="?/exercise"
				onUpdate={({ result, formElement, cancel }) => {
					if (result.type === 'success') {
						$data.exercises = [
							...$data.exercises,
							result.data.form.data as z.infer<typeof exerciseFormSchema>
						];
						handleCloseModal();
						formElement.reset();
						cancel();
					}
				}}
			/>
		{/key}
	</div>
</Dialog>

<style>
	.workout-form {
		display: grid;
		grid-template: auto 1fr auto / 1fr;
		gap: var(--base-spacing);
		height: 100%;
	}

	.workout-form__info {
		display: flex;
		gap: var(--base-spacing);
		flex-direction: column;
	}

	.workout-form__exercise-list {
		height: 100%;
	}

	.workout-form__title {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.workout-form__exercise-list-title {
		display: flex;
		align-items: center;
		gap: var(--base-spacing);
	}

	.exercise-dialog {
		padding: calc(var(--base-spacing) * 2);
	}

	h3 {
		margin-top: 0;
	}
</style>
