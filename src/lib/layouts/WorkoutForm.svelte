<script module lang="ts">
	export type WorkoutFormData = {
		name: string;
		description: string;
		exercises: WorkoutExercise[];
	};

	type WorkoutFormProps = {
		title: string;
		onsave: (data: WorkoutFormData) => void | Promise<void>;
		data?: WorkoutFormData;
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

	let {
		title,
		onsave,
		data = $bindable({ name: '', description: '', exercises: [] })
	}: WorkoutFormProps = $props();
</script>

<form
	class="workout-form"
	onsubmit={(e) => {
		e.preventDefault();
		onsave(data);
	}}
>
	<div class="workout-form__info">
		<div class="workout-form__title">
			<h2>{title}</h2>
			<button onclick={() => onsave(data)}>Save</button>
		</div>
		<label>
			Name
			<input
				bind:value={data.name}
				required
				type="text"
				name="name"
				placeholder="E.g.: Chest & Triceps"
			/>
		</label>
		<label>
			Description
			<textarea
				bind:value={data.description}
				name="description"
				placeholder="E.g.: Do it twice a week"
			></textarea>
		</label>
	</div>
	<div class="workout-form__exercise-list">
		<div class="workout-form__exercise-list-title">
			<h2>Exercises</h2>
			<button
				class="button--text"
				onclick={() => pushState('/new', { modalShown: 'add-exercise' })}
			>
				+ ADD EXERCISE
			</button>
		</div>
		{#each data.exercises ?? [] as exercise}
			<ExerciseListItem {exercise}>
				{#snippet decoration()}
					<button
						type="button"
						onclick={() => (data.exercises = data.exercises?.filter((item) => item !== exercise))}
						class="button--text exercise-list-item__decoration"
					>
						Remove
					</button>
				{/snippet}
			</ExerciseListItem>
		{/each}
	</div>
</form>

<ExerciseDialog
	open={$page.state.modalShown === 'add-exercise'}
	onclose={handleCloseModal}
	onsubmit={(event: SubmitEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		data.exercises?.push({
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

	textarea,
	input {
		width: 100%;
	}
</style>
