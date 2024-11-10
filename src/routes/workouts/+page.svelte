<script lang="ts">
	import type { PageServerData } from './$types';
	import WorkoutListItem from './components/WorkoutListItem.svelte';

	let { data }: { data: PageServerData } = $props();

	let searchTerm = $state('');
	let filteredWorkouts = $derived(
		data.workouts?.filter((workout) =>
			workout.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
		) ?? []
	);
</script>

<div class="workouts">
	<a href="/new" class="workouts__add">Add Workout</a>
	<input class="workouts__search" type="text" bind:value={searchTerm} placeholder="Search..." />
	<div class="workouts__list">
		{#each filteredWorkouts as workout}
			<WorkoutListItem {workout} />
		{/each}
	</div>
</div>

<style>
	.workouts {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-spacing) * 2);
	}

	.workouts__add {
		align-self: flex-end;
	}
</style>
