<script lang="ts">
	import WorkoutList from '$lib/layouts/WorkoutList.svelte';
	import type { PageServerData } from './$types';
	import { m } from '$lib/paraglide/messages';
	import { Button } from '$lib/components/button';

	let { data }: { data: PageServerData } = $props();
</script>

<WorkoutList workouts={data.workouts}>
	{#snippet action()}
		<Button href="/new" class="link">+ {m.create_workout()}</Button>
	{/snippet}
</WorkoutList>
