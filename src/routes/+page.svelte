<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import WorkoutList from '$lib/layouts/WorkoutList.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<WorkoutList workouts={data.workouts}>
	{#snippet action()}
		<Link href="/new" class="link">+ Create Workout</Link>
	{/snippet}
</WorkoutList>
