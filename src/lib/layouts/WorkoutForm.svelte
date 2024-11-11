<script module lang="ts">
	export type WorkoutFormData = {
		name: string;
		description: string;
		exercises: WorkoutExercise[];
	};

	type WorkoutFormProps = {
		title: string;
		onsave: (data: WorkoutFormData) => void | Promise<void>;
		data: WorkoutFormData;
	};
</script>

<script lang="ts">
	import { pushState, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import ExerciseListItem from '$lib/components/ExerciseListItem.svelte';
	import type { Database } from '$lib/supabase/database.types';
	import type { WorkoutExercise } from '$lib/types';
	import ExerciseDialog from './ExerciseDialog.svelte';

	const handleCloseModal = () => replaceState('/new', { modalShown: undefined });

	let { title, onsave, data = $bindable() }: WorkoutFormProps = $props();
</script>

<div class="workout-form">
	<button onclick={() => onsave(data)}>v Save</button>
	<h2>{title}</h2>
	<label for="name">Name</label>
	<input
		bind:value={data.name}
		id="name"
		type="text"
		name="name"
		placeholder="E.g.: Chest & Triceps"
	/>
	<label for="description">Description</label>
	<textarea
		bind:value={data.description}
		id="description"
		name="description"
		placeholder="E.g.: Do it twice a week"
	></textarea>
	<button onclick={() => pushState('/new', { modalShown: 'add-exercise' })}>Add exercise +</button>
	<div class="workout-form__exercise-list">
		{#each data.exercises ?? [] as exercise}
			<ExerciseListItem {exercise}>
				{#snippet decoration()}
					<button
						type="button"
						onclick={() => (data.exercises = data.exercises.filter((item) => item !== exercise))}
						class="button--text exercise-list-item__decoration"
					>
						Remove
					</button>
				{/snippet}
			</ExerciseListItem>
		{/each}
	</div>
</div>

<ExerciseDialog
	open={$page.state.modalShown === 'add-exercise'}
	onclose={handleCloseModal}
	onsubmit={(event: SubmitEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		data.exercises.push({
			exercise: JSON.parse(
				formData.get('exercise') as string
			) as Database['public']['Tables']['exercises']['Row'],
			sets: Number(formData.get('sets')),
			repetitions: Number(formData.get('repetitions')),
			notes: formData.get('notes') as string,
			rest: Number(formData.get('rest'))
		});

		handleCloseModal();
	}}
/>

<style>
	.workout-form {
		display: flex;
		flex-direction: column;
		gap: var(--base-spacing);
	}
</style>
