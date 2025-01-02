<script lang="ts">
	import WorkoutForm from '$lib/forms/WorkoutForm.svelte';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();
</script>

<WorkoutForm title="New Workout" {...data} />
