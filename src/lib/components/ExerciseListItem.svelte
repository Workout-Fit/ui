<script lang="ts">
	import type { WorkoutExercise } from '$lib/types';
	import type { Snippet } from 'svelte';
	import ListItem from './ListItem.svelte';

	let { exercise, decoration }: { exercise: WorkoutExercise; decoration?: Snippet } = $props();
</script>

<ListItem
	title={exercise.exercise.i18n[0].name}
	secondLine={`${exercise.sets}×${exercise.repetitions}${exercise.rest !== undefined ? `, rest for ${exercise.rest}"` : ''}`}
	thirdLine={exercise.notes ?? undefined}
	rightDecoration={decoration}
/>
