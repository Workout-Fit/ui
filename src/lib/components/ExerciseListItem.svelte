<script lang="ts">
	import type { WorkoutExercise } from '$lib/types';
	import type { Snippet } from 'svelte';
	import ListItem from './ListItem.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { exercise, decoration }: { exercise: WorkoutExercise; decoration?: Snippet } = $props();
</script>

<ListItem
	title={exercise.exercise.name}
	secondLine={`${exercise.sets}×${exercise.repetitions}${exercise.rest !== undefined ? `, ${m.rest_for({ rest: exercise.rest })}"` : ''}`}
	thirdLine={exercise.notes ?? undefined}
	rightDecoration={decoration}
/>
