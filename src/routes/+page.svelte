<script lang="ts">
	import WorkoutList from '$lib/layouts/WorkoutList.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<WorkoutList workouts={data.workouts}>
	{#snippet action()}
		<a href="/new" class="link">+ Create Workout</a>
	{/snippet}
</WorkoutList>
