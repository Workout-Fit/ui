<script lang="ts">
	import type getWorkouts from '$lib/supabase/queries/getWorkouts';
	import type { Snippet } from 'svelte';
	import ListItem from '../components/ListItem.svelte';

	type WorkoutListProps = {
		workouts: Exclude<Awaited<ReturnType<typeof getWorkouts>>['data'], null>;
		action?: Snippet;
	};

	const { workouts, action }: WorkoutListProps = $props();

	let searchTerm = $state('');
	let filteredWorkouts = $derived(
		workouts?.filter((workout) =>
			workout.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
		) ?? []
	);
</script>

<div class="workouts">
	<div class="workouts__title">
		<h2>Workouts <small>{workouts.length}</small></h2>
		{#if action}{@render action()}{/if}
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
		width: 100%;
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
