<script lang="ts">
	import WorkoutForm, { workoutFormSchema } from '$lib/forms/WorkoutForm.svelte';
	import type { PageServerData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-french-toast';
	import { type SuperForm } from 'sveltekit-superforms';
	import type { z } from 'zod';

	const { data }: { data: PageServerData } = $props();
	let form: SuperForm<z.infer<typeof workoutFormSchema>> | undefined = $state();

	export const snapshot = {
		capture: () => form?.capture(),
		restore: (snapshot) => form?.restore(snapshot)
	};
</script>

<WorkoutForm
	title={m.create_workout()}
	onResult={({ result }) => {
		if (result.type === 'error') toast.error(result.error.message);
		else if (result.type === 'redirect') {
			toast.success(m.create_workout_success());
			goto(result.location, { invalidateAll: true });
		}
	}}
	bind:form
	data={data.form}
	exerciseFormData={data.exerciseFormData}
/>
