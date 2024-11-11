<script lang="ts">
	import Autocomplete from '$lib/components/Autocomplete.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import FormActions from '$lib/components/FormActions.svelte';
	import type { Database } from '$lib/supabase/database.types';

	type ExerciseDialogProps = {
		open: boolean;
		onclose: () => void;
		onsubmit: (e: SubmitEvent) => void;
	};

	let { open, onclose, onsubmit }: ExerciseDialogProps = $props();

	const loadExercises = async (query: string) => {
		const response = await fetch(`/api/exercises?query=${query}`);
		return await response.json();
	};
</script>

{#snippet exerciseAutocompleteEntry(item: Database['public']['Tables']['exercises']['Row'])}
	{item.name}
{/snippet}

<Dialog {open} {onclose}>
	<form class="exercise-form" {onsubmit}>
		<h3>Add Exercise</h3>
		<Autocomplete
			id="exercise"
			loadFunction={loadExercises}
			name="exercise"
			debounceValue={300}
			searchThreshold={3}
			renderValue={exerciseAutocompleteEntry}
			renderItem={exerciseAutocompleteEntry}
		/>
		<input required type="number" name="sets" placeholder="Sets" />
		<input required type="number" name="repetitions" placeholder="Repetitions" />
		<input type="number" name="rest" placeholder="Rest" />
		<textarea name="notes" placeholder="Notes"></textarea>

		<FormActions oncancel={() => undefined} />
	</form>
</Dialog>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: var(--base-spacing);
		padding: calc(2 * var(--base-spacing));
		min-width: 300px;
	}

	h3 {
		margin: 0;
	}

	.exercise-form :global(.form-actions) {
		margin-left: auto;
	}
</style>
