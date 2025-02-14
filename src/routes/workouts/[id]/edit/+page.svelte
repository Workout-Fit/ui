<script lang="ts">
	import WorkoutForm from '$lib/forms/WorkoutForm.svelte';
	import type { PageServerData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-french-toast';

	let { data }: { data: PageServerData } = $props();
</script>

<WorkoutForm
	onResult={({ result }) => {
		if (result.type === 'error') toast.error(result.error.message);
		else if (result.type === 'redirect') {
			toast.success(m.edit_workout_success());
			goto(result.location, { invalidateAll: true });
		}
	}}
	title={m.edit_workout()}
	data={data.form}
	exerciseFormData={data.exerciseFormData}
/>
