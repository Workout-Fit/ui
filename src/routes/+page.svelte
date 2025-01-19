<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import WorkoutList from '$lib/layouts/WorkoutList.svelte';
	import type { PageServerData } from './$types';
	import * as m from '$lib/paraglide/messages';

	let { data }: { data: PageServerData } = $props();
</script>

<WorkoutList workouts={data.workouts}>
	{#snippet action()}
		<Link href="/new" class="link">+ {m.create_workout()}</Link>
	{/snippet}
</WorkoutList>
