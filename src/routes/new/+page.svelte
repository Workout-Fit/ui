<script lang="ts">
	import WorkoutForm from '$lib/forms/WorkoutForm.svelte';
	import type { PageServerData } from './$types';
	import * as m from '$lib/paraglide/messages';

	const { data }: { data: PageServerData } = $props();
</script>

<WorkoutForm title={m.new_workout()} {...data} />
