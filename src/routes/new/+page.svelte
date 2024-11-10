<script module lang="ts">
	export type WorkoutExercise = Omit<
		Database['public']['Tables']['workouts_exercises']['Row'],
		'workout_id' | 'exercise_id'
	> & {
		exercise: Database['public']['Tables']['exercises']['Row'];
	};

	export type WorkoutFormData = {
		name: string;
		description: string;
		workoutExercises: WorkoutExercise[];
	};
</script>

<script lang="ts">
	import { pushState, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import usePersistOnUnmount from '$lib/hooks/usePersistOnUnmount';
	import type { Database } from '$lib/supabase/database.types';
	import type { PageData } from './$types';
	import ExerciseDialog from './components/ExerciseDialog.svelte';
	import ExerciseListItem from './components/ExerciseListItem.svelte';

	const handleCloseModal = () => replaceState('/new', { modalShown: undefined });

	let { data }: { data: PageData } = $props();

	let workoutExercises: Array<WorkoutExercise> = $state(data.initialValue?.workoutExercises ?? []);
	let description = $state(data.initialValue?.description ?? '');
	let name = $state(data.initialValue?.name ?? '');

	usePersistOnUnmount('new-workout', () => ({ name, description, workoutExercises }));
</script>

<div class="new-workout">
	<h2>New Workout</h2>
	<label for="name">Name</label>
	<input bind:value={name} id="name" type="text" name="name" placeholder="E.g.: Chest & Triceps" />
	<label for="description">Description</label>
	<textarea
		bind:value={description}
		id="description"
		name="description"
		placeholder="E.g.: Do it twice a week"
	></textarea>
	<button onclick={() => pushState('/new', { modalShown: 'add-exercise' })}>Add exercise +</button>

	{#each workoutExercises as exercise}
		<ExerciseListItem {exercise}>
			{#snippet decoration()}
				<button
					type="button"
					onclick={() => {
						workoutExercises = workoutExercises.filter((item) => item !== exercise);
					}}
					class="button--text"
				>
					Remove
				</button>
			{/snippet}
		</ExerciseListItem>
	{/each}
</div>

<ExerciseDialog
	open={$page.state.modalShown === 'add-exercise'}
	onclose={handleCloseModal}
	onsubmit={(event: SubmitEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		workoutExercises.push({
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
	.new-workout {
		display: flex;
		flex-direction: column;
		gap: var(--base-spacing);
	}
</style>
