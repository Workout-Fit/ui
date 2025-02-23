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
	import FormInput from '$lib/components/ui/form-input/form-input.svelte';
	import { Dialog, DialogContent, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
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

<form
	class="grid-rows-[auto 1fr auto] grid h-full grid-cols-1 gap-2"
	action="?/workout"
	method="POST"
	use:enhance
>
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<h2 class="text-2xl">{title}</h2>
			<Button type="submit" disabled={$submitting} loading={$delayed}>{m.save()}</Button>
		</div>

		<FormInput
			label={m.name()}
			type="text"
			{form}
			disabled={$submitting}
			field="name"
			placeholder={m.workout_name_placeholder()}
		/>
		<FormInput
			label={m.notes()}
			{form}
			disabled={$submitting}
			multiline
			field="notes"
			placeholder={m.workout_notes_placeholder()}
		/>
	</div>
	<div class="h-full">
		<div class="flex items-center gap-2">
			<h2>{m.exercises()}</h2>
			<Button
				variant="link"
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
						<div class="flex gap-2">
							<Button
								type="button"
								disabled={$submitting}
								onclick={() => {
									pushState('', { modalShown: 'save-exercise', exerciseIndex: index });
									exerciseForm?.reset({ data: exercise });
								}}
								variant="link"
							>
								{m.edit()}
							</Button>
							<Button
								type="button"
								disabled={$submitting}
								onclick={() =>
									($formData.exercises =
										$formData.exercises?.filter((item) => item !== exercise) ?? [])}
								variant="link"
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

<Dialog
	open={page.state.modalShown === 'save-exercise'}
	onOpenChange={(open) => {
		if (!open) handleCloseModal();
	}}
>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>{m.add_exercise()}</DialogTitle>
		</DialogHeader>
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
	</DialogContent>
</Dialog>
