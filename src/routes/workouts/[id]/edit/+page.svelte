<script lang="ts">
	import WorkoutForm from '$lib/forms/WorkoutForm.svelte';
	import type { PageServerData } from './$types';
	import * as m from '$lib/paraglide/messages';

	let { data }: { data: PageServerData } = $props();
</script>

<WorkoutForm title={m.edit_workout()} data={data.form} exerciseFormData={data.exerciseFormData} />
