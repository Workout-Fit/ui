<script module lang="ts">
	import { z } from 'zod';
	import {
		superForm,
		type FormOptions,
		type SuperForm,
		type SuperValidated
	} from 'sveltekit-superforms';

	type WorkoutFormProps = {
		title: string;
		data: SuperValidated<z.infer<typeof workoutFormSchema>>;
		form?: SuperForm<z.infer<typeof workoutFormSchema>>;
		exerciseFormData: SuperValidated<z.infer<typeof exerciseFormSchema>>;
	} & Omit<FormOptions<z.infer<typeof workoutFormSchema>>, 'validators' | 'dataType'>;

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
	import ExerciseForm, { exerciseFormSchema } from './ExerciseForm.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Button from '$lib/components/Button.svelte';
	import List from '$lib/components/List.svelte';
	import * as m from '$lib/paraglide/messages';
	import { zodClient } from 'sveltekit-superforms/adapters';

	const handleCloseModal = () =>
		replaceState('', { modalShown: undefined, exerciseIndex: undefined });

	let { title, data, form = $bindable(), exerciseFormData, ...rest }: WorkoutFormProps = $props();

	if (form === undefined)
		form = superForm(data, {
			validators: zodClient(workoutFormSchema),
			dataType: 'json',
			...rest
		});
	const {
		form: formData,
		enhance,
		submitting,
		delayed
	} = form as SuperForm<z.infer<typeof workoutFormSchema>>;
	let exerciseForm: SuperForm<z.infer<typeof exerciseFormSchema>> | undefined = $state();
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
				onclick={() => {
					exerciseForm?.reset();
					pushState('', { modalShown: 'save-exercise' });
				}}
			>
				+ {m.add_exercise()}
			</Button>
		</div>
		<List items={$formData.exercises} emptyMessage="No exercises added">
			{#snippet item(exercise, index)}
				<ExerciseListItem {exercise}>
					{#snippet decoration()}
						<div class="workout-form__exercise-list-item-actions">
							<Button
								type="button"
								disabled={$submitting}
								onclick={() => {
									pushState('', { modalShown: 'save-exercise', exerciseIndex: index });
									exerciseForm?.reset({ data: exercise });
								}}
								variant="text"
							>
								{m.edit()}
							</Button>
							<Button
								type="button"
								disabled={$submitting}
								onclick={() =>
									($formData.exercises =
										$formData.exercises?.filter((item) => item !== exercise) ?? [])}
								variant="text"
							>
								{m.remove()}
							</Button>
						</div>
					{/snippet}
				</ExerciseListItem>
			{/snippet}
		</List>
	</div>
</form>

<Dialog open={page.state.modalShown === 'save-exercise'} onclose={handleCloseModal}>
	<div class="exercise-dialog">
		<h3>{m.add_exercise()}</h3>
		<ExerciseForm
			oncancel={handleCloseModal}
			data={exerciseFormData}
			bind:form={exerciseForm}
			action="?/exercise"
			onUpdate={({ result, cancel }) => {
				if (result.type === 'success') {
					$formData.exercises =
						page.state.exerciseIndex !== undefined
							? [
									...$formData.exercises.slice(0, page.state.exerciseIndex),
									result.data.form.data as z.infer<typeof exerciseFormSchema>,
									...$formData.exercises.slice(page.state.exerciseIndex + 1)
								]
							: [
									...$formData.exercises,
									result.data.form.data as z.infer<typeof exerciseFormSchema>
								];
					handleCloseModal();
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

	h3 {
		margin-top: 0;
	}

	.workout-form__exercise-list-item-actions {
		display: flex;
		gap: var(--base-spacing);
	}
</style>
