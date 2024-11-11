<script lang="ts">
	import ExerciseListItem from '$lib/components/ExerciseListItem.svelte';
	import type { WorkoutExercise } from '$lib/types';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	$inspect(data.workout);
</script>

{#if data.workout?.creation_date}
	<small>
		Created on {new Date(data.workout?.creation_date).toLocaleDateString()}
	</small>
{/if}
<h2>{data.workout?.name}</h2>
<span>{data.workout?.description}</span>

<div class="workout__exercise-list">
	{#each data.workout?.exercises ?? [] as exercise}
		<ExerciseListItem exercise={exercise as WorkoutExercise} />
	{/each}
</div>
