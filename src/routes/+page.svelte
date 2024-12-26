<script lang="ts">
	import WorkoutList from '$lib/components/WorkoutList.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<WorkoutList workouts={data.workouts}>
	{#snippet action()}
		<a href="/new" class="workouts__add button button--text">+ Create Workout</a>
	{/snippet}
</WorkoutList>
