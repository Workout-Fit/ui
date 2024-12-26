<script lang="ts">
	import ExerciseListItem from '$lib/components/ExerciseListItem.svelte';
	import type { WorkoutExercise } from '$lib/types';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="workout">
	<div class="workout__info">
		{#if data.workout?.creation_date}
			<small>
				Created on {new Date(data.workout?.creation_date).toLocaleDateString()}
			</small>
		{/if}
		<h1>{data.workout?.name}</h1>
		<span>{data.workout?.description}</span>
		{#if data.editable}
			<a href={`/workouts/${data.workout?.id}/edit`}>Edit</a>
		{/if}
	</div>

	<div class="workout__exercise-list">
		<h2>Exercises</h2>
		{#each data.workout?.exercises ?? [] as exercise}
			<ExerciseListItem exercise={exercise as WorkoutExercise} />
		{/each}
	</div>
</div>

<style>
	h1 {
		margin: 0;
	}

	h2 {
		margin: var(--base-spacing) 0;
	}

	.workout__exercise-list {
		margin-top: calc(var(--base-spacing) * 4);
	}
</style>
