<script lang="ts">
	import WorkoutForm, { type WorkoutFormData } from '$lib/layouts/WorkoutForm.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	const onsave = () => {};

	let formData: WorkoutFormData = $state(data.workout as WorkoutFormData);
</script>

<WorkoutForm title="Edit Workout" {onsave} data={formData} />
