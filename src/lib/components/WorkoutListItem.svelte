<script lang="ts">
	import type getWorkouts from '$lib/supabase/queries/getWorkouts';
	import ListItem from './ListItem.svelte';

	type Workout = Exclude<Awaited<ReturnType<typeof getWorkouts>>['data'], null>[0];

	const { workout }: { workout: Workout } = $props();
</script>

<ListItem
	title={workout.name}
	secondLine={workout.description ?? undefined}
	href={`/workouts/${workout.id}`}
>
	{#snippet rightDecoration()}
		<small>{workout.exercises[0]?.count} exercises</small>
	{/snippet}
</ListItem>
