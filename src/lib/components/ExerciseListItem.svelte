<script lang="ts">
	import type { WorkoutExercise } from '$lib/types';
	import type { Snippet } from 'svelte';

	let { exercise, decoration }: { exercise: WorkoutExercise; decoration?: Snippet } = $props();
</script>

<div class="exercise-list-item">
	<h4 class="exercise-list-item__name">{exercise.exercise.name}</h4>
	<small class="exercise-list-item__sets">
		{exercise.sets} &times; {exercise.repetitions}
		{#if exercise.rest}
			rest for {exercise.rest}
		{/if}
	</small>
	{#if exercise.notes}<small class="exercise-list-item__notes">Notes: {exercise.notes}</small>{/if}
	{#if decoration}<div class="exercise-list-item__decoration">{@render decoration()}</div>{/if}
</div>

<style>
	.exercise-list-item {
		display: grid;
		grid-auto-flow: column;
		grid-template: repeat(3, auto) / 1fr auto;
		gap: calc(0.5 * var(--base-spacing));
	}

	h4 {
		margin: 0;
	}

	.exercise-list-item__sets,
	.exercise-list-item__notes {
		color: var(--text-medium);
	}

	.exercise-list-item__decoration {
		grid-column: -1;
	}
</style>
