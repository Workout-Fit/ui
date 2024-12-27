<script lang="ts">
	import { goto } from '$app/navigation';
	import WorkoutForm, { type WorkoutFormData } from '$lib/forms/WorkoutForm.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	const onsave = async () => {
		const saveWorkout = await fetch(`/api/workouts/${data.workout.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		});
		if (saveWorkout.ok) {
			goto(`/workouts/${data.workout.id}`);
		} else console.error('Failed to create workout');
	};

	let formData: WorkoutFormData = $state(data.workout as WorkoutFormData);
</script>

<WorkoutForm title="Edit Workout" {onsave} data={formData} />
