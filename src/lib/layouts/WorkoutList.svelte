<script lang="ts">
	import type getWorkouts from '$lib/supabase/queries/getWorkouts';
	import type { Snippet } from 'svelte';
	import ListItem from '../components/ListItem.svelte';
	import List from '$lib/components/List.svelte';
	import * as m from '$lib/paraglide/messages';

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
		<h2>{m.workouts()} <small>{workouts.length}</small></h2>
		{#if action}{@render action()}{/if}
	</div>
	<input
		class="input workouts__search"
		type="text"
		bind:value={searchTerm}
		placeholder={`${m.search()}...`}
	/>
	<List items={filteredWorkouts} emptyMessage={m.empty_workout_list()}>
		{#snippet item(workout)}
			<ListItem
				title={workout.name}
				secondLine={workout.notes ?? undefined}
				href={`/workouts/${workout.id}`}
			>
				{#snippet rightDecoration()}
					<small>{workout.exercises[0]?.count} {m.exercises()}</small>
				{/snippet}
			</ListItem>
		{/snippet}
	</List>
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
