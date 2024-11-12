<script lang="ts">
	import { goto } from '$app/navigation';
	import usePersistOnUnmount from '$lib/hooks/usePersistOnUnmount.svelte';
	import WorkoutForm, { type WorkoutFormData } from '$lib/layouts/WorkoutForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let saveOnExit = $state(true);

	const LOCALSTORAGE_KEY = 'new-workout';

	const onsave = async (data: WorkoutFormData) => {
		const createWorkout = await fetch('/api', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (createWorkout.ok) {
			saveOnExit = false;
			const { id }: { id: string } = await createWorkout.json();
			goto(`/workouts/${id}`);
			localStorage.removeItem(LOCALSTORAGE_KEY);
		} else console.error('Failed to create workout');
	};

	let formData: WorkoutFormData = $state({
		name: '',
		description: '',
		exercises: [],
		...data.initialValue
	});

	// svelte-ignore state_referenced_locally
	usePersistOnUnmount(LOCALSTORAGE_KEY, saveOnExit, formData);
</script>

<WorkoutForm {onsave} title="New Workout" bind:data={formData} />
