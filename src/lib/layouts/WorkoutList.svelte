<script lang="ts">
	import type getWorkouts from '$lib/supabase/queries/getWorkouts';
	import type { Snippet } from 'svelte';
	import { List, ListItem } from '$lib/components/list';
	import { m } from '$lib/paraglide/messages';
	import { Input } from '$lib/components/input';

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

<div class="flex w-full flex-col gap-4">
	<div class="flex items-center justify-between">
		<h2 class="m-0 text-2xl font-bold">{m.workouts()} <small>{workouts.length}</small></h2>
		{#if action}{@render action()}{/if}
	</div>
	<Input bind:value={searchTerm} placeholder={`${m.search()}...`} />
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
