<script lang="ts">
	import ListItem from '$lib/components/ListItem.svelte';
	import type { PageServerData } from '../$types';
	import type { IterableElement } from 'type-fest';

	type Workout = IterableElement<PageServerData['workouts']>;

	let { workout }: { workout: Workout } = $props();
</script>

<ListItem title={workout.name} subtitle={workout.description} href={`/workouts/${workout.id}`}>
	{#snippet rightDecoration()}
		<small>{workout.exercises[0]?.count}</small>
	{/snippet}
</ListItem>
