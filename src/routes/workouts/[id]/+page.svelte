<script lang="ts">
	import ExerciseListItem from '$lib/components/ExerciseListItem.svelte';
	import type { WorkoutExercise } from '$lib/types';
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import { page } from '$app/state';
	import { showToast } from '$lib/utils/toast';

	let { data }: { data: PageServerData } = $props();

	onMount(() => {
		if (page.url.searchParams.get('showToast') === 'clone-success')
			showToast('success', { text: 'Successfully cloned workout' });
	});
</script>

<div class="workout">
	<div class="workout__info">
		{#if data.workout?.creation_date}
			<small>
				Created on {new Date(data.workout?.creation_date).toLocaleDateString()}
			</small>
		{/if}
		<h1>{data.workout?.name}</h1>
		<span>{data.workout?.description}</span>
		<div class="workout__actions">
			{#if data.editable}
				<a class="button button--text" href={`/workouts/${data.workout?.id}/edit`}>Edit</a>
			{/if}
			<a
				class="button button--text"
				data-sveltekit-preload-data="tap"
				href={`/workouts/${data.workout?.id}/clone`}>Clone</a
			>
		</div>
	</div>

	<div class="workout__exercise-list">
		<h2>Exercises</h2>
		{#each data.workout?.exercises ?? [] as exercise}
			<ExerciseListItem exercise={exercise as WorkoutExercise} />
		{/each}
	</div>
</div>

<style>
	h1 {
		margin: 0;
	}

	h2 {
		margin: var(--base-spacing) 0;
	}

	.workout__exercise-list {
		margin-top: calc(var(--base-spacing) * 4);
	}

	.workout__actions {
		display: flex;
		gap: calc(var(--base-spacing) * 2);
	}
</style>
