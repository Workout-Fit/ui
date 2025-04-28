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
	import { goto, pushState, replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import ExerciseListItem from '$lib/layouts/ExerciseListItem.svelte';
	import ExerciseForm, { exerciseFormSchema } from './ExerciseForm.svelte';
	import { FormInput } from '$lib/components/form-input';
	import { Dialog, DialogContent, DialogHeader, DialogTitle } from '$lib/components/dialog';
	import { Button } from '$lib/components/button';
	import { List } from '$lib/components/list';
	import { m } from '$lib/paraglide/messages';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';

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
		delayed,
		message
	} = form as SuperForm<z.infer<typeof workoutFormSchema>>;

	const exerciseForm = superForm(exerciseFormData, {
		validators: zodClient(exerciseFormSchema),
		dataType: 'json',
		onUpdate: ({ result, cancel }) => {
			if (result.type === 'success') {
				const exercise = result.data.form.data;
				$formData.exercises =
					page.state.exerciseIndex !== undefined
						? [
								...$formData.exercises.slice(0, page.state.exerciseIndex),
								exercise,
								...$formData.exercises.slice(page.state.exerciseIndex + 1)
							]
						: [...$formData.exercises, { ...exercise, id: exercise.id ?? `added:${Date.now()}` }];
				handleCloseModal();
				cancel();
			}
		}
	});

	const handleCloseModal = () => {
		replaceState('', { modalShown: undefined, exerciseIndex: undefined });
	};

	$effect(() => {
		if ($message) toast[$message.type]($message.text);
	});
</script>

<form
	class="grid-rows-[auto 1fr auto] grid h-full grid-cols-1 gap-2"
	action="?/workout"
	method="POST"
	use:enhance
>
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<h2 class="text-2xl font-bold">{title}</h2>
			<div class="flex gap-2">
				<Button
					variant="secondary"
					disabled={$submitting}
					onclick={() => {
						if (page.params.id) goto(`/workouts/${page.params.id}`, { replaceState: true });
						else history.back();
					}}
				>
					{m.cancel()}
				</Button>
				<Button type="submit" disabled={$submitting} loading={$delayed}>{m.save()}</Button>
			</div>
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
</form>
<div class="h-full">
	<div class="flex items-center gap-2">
		<h2 class="text-2xl font-bold">{m.exercises()}</h2>
		<Button
			variant="ghost"
			disabled={$submitting}
			onclick={() => {
				pushState('', { modalShown: 'save-exercise' });
			}}
		>
			+ {m.add_exercise()}
		</Button>
	</div>
	<List
		items={$formData.exercises}
		onReorder={(items) => {
			$formData.exercises = [...items];
		}}
		sortable
		emptyMessage="No exercises added"
	>
		{#snippet item(exercise, index)}
			<ExerciseListItem {exercise}>
				{#snippet decoration()}
					<div class="flex gap-2">
						<Button
							disabled={$submitting}
							onclick={() =>
								($formData.exercises =
									$formData.exercises?.filter((item) => item !== exercise) ?? [])}
							variant="ghost"
						>
							{m.remove()}
						</Button>
						<Button
							disabled={$submitting}
							onclick={() => {
								exerciseForm?.reset({ data: $formData.exercises[index] });
								pushState('', { modalShown: 'save-exercise', exerciseIndex: index });
							}}
							variant="ghost"
						>
							{m.edit()}
						</Button>
					</div>
				{/snippet}
			</ExerciseListItem>
		{/snippet}
	</List>
</div>

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
		<ExerciseForm oncancel={handleCloseModal} form={exerciseForm} action="?/exercise" />
	</DialogContent>
</Dialog>
