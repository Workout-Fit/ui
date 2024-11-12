<script lang="ts">
	import ListItem from '$lib/components/ListItem.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	let searchTerm = $state('');
	let filteredWorkouts = $derived(
		data.workouts?.filter((workout) =>
			workout.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
		) ?? []
	);
</script>

<div class="workouts">
	<div class="workouts__title">
		<h2>Workouts</h2>
		<a href="/new" class="workouts__add button button--text">+ Create Workout</a>
	</div>
	<input class="workouts__search" type="text" bind:value={searchTerm} placeholder="Search..." />
	<div class="workouts__list">
		{#each filteredWorkouts as workout}
			<ListItem
				title={workout.name}
				secondLine={workout.description ?? undefined}
				href={`/workouts/${workout.id}`}
			>
				{#snippet rightDecoration()}
					<small>{workout.exercises[0]?.count} exercises</small>
				{/snippet}
			</ListItem>
		{/each}
	</div>
</div>

<style>
	.workouts {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-spacing) * 2);
	}

	.workouts__title {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.workouts__title h2 {
		margin: 0;
	}
</style>
