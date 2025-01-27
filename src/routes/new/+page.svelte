<script lang="ts">
	import WorkoutForm, { workoutFormSchema } from '$lib/forms/WorkoutForm.svelte';
	import type { PageServerData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';
	import { showToast } from '$lib/utils/toast';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	const { data }: { data: PageServerData } = $props();
	const form = superForm(data.form, {
		validators: zodClient(workoutFormSchema),
		dataType: 'json',
		onResult: ({ result }) => {
			if (result.type === 'error') showToast('error', { text: result.error.message });
			else if (result.type === 'redirect') {
				showToast('success', { text: m.create_workout_success() });
				goto(result.location, { invalidateAll: true });
			}
		}
	});
</script>

<WorkoutForm title={m.edit_workout()} {form} exerciseForm={data.exerciseForm} />
