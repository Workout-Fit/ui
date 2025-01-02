<script lang="ts">
	import WorkoutForm from '$lib/forms/WorkoutForm.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<WorkoutForm title="Edit Workout" {...data} />
