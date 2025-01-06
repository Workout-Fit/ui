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
		description: z.string().nullable(),
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

	const handleCloseModal = () => replaceState('', { modalShown: undefined });

	let { title, form: formData, exerciseForm }: WorkoutFormProps = $props();

	const _form = superForm(formData, {
		validators: zodClient(workoutFormSchema),
		dataType: 'json'
	});

	const { form, enhance } = _form;
</script>

<form class="workout-form" action="?/workout" method="POST" use:enhance>
	<div class="workout-form__info">
		<div class="workout-form__title">
			<h2>{title}</h2>
			<button type="submit">Save</button>
		</div>

		<TextField label="Name" type="text" form={_form} field="name" placeholder="Chest & Triceps" />
		<TextField
			label="Description"
			form={_form}
			multiline
			field="description"
			placeholder="Do it twice a week"
		/>
	</div>
	<div class="workout-form__exercise-list">
		<div class="workout-form__exercise-list-title">
			<h2>Exercises</h2>
			<button
				class="button--text"
				type="button"
				onclick={() => pushState('', { modalShown: 'add-exercise' })}
			>
				+ ADD EXERCISE
			</button>
		</div>
		{#each $form.exercises as exercise}
			<ExerciseListItem exercise={exercise as WorkoutExercise}>
				{#snippet decoration()}
					<button
						type="button"
						onclick={() =>
							($form.exercises = $form.exercises?.filter((item) => item !== exercise) ?? [])}
						class="button--text exercise-list-item__decoration"
					>
						Remove
					</button>
				{/snippet}
			</ExerciseListItem>
		{/each}
	</div>
</form>

<Dialog open={page.state.modalShown === 'add-exercise'} onclose={handleCloseModal}>
	<div class="exercise-dialog">
		<h3>Add Exercise</h3>
		<ExerciseForm
			oncancel={handleCloseModal}
			form={exerciseForm}
			action="?/exercise"
			onUpdate={({ result, formElement, cancel }) => {
				if (result.type === 'success') {
					$form.exercises = [
						...$form.exercises,
						result.data.form.data as z.infer<typeof exerciseFormSchema>
					];
					handleCloseModal();
					formElement.reset();
					cancel();
				}
			}}
		/>
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
</style>
