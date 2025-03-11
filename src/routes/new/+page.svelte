<script lang="ts">
	import WorkoutForm, { workoutFormSchema } from '$lib/forms/WorkoutForm.svelte';
	import type { PageServerData } from './$types';
	import { m } from '$lib/paraglide/messages';
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
	bind:form
	data={data.form}
	exerciseFormData={data.exerciseFormData}
/>
