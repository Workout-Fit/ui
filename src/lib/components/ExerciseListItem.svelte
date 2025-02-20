<script lang="ts">
	import type { WorkoutExercise } from '$lib/types';
	import type { Snippet } from 'svelte';
	import ListItem from './ListItem.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		exercise,
		decoration,
		onclick
	}: {
		exercise: WorkoutExercise;
		decoration?: Snippet;
		onclick?: () => void;
	} = $props();

	let formatSets = $derived(
		exercise.sets
			?.map(
				(set, index) =>
					`${set} × ${exercise.repetitions[index]}${exercise.rests?.[index] != null ? ` - ${m.rest_for({ rest: exercise.rests[index] })}` : ''}`
			)
			.join('\n')
	);
</script>

<ListItem
	title={exercise.exercise.name}
	secondLine={formatSets}
	thirdLine={exercise.notes ?? undefined}
	rightDecoration={decoration}
	{onclick}
/>
