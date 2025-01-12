<script lang="ts">
	import ExerciseListItem from '$lib/components/ExerciseListItem.svelte';
	import type { WorkoutExercise } from '$lib/types';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import { showToast } from '$lib/utils/toast';
	import Button from '$lib/components/Button.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import { goto, invalidate, replaceState } from '$app/navigation';
	import { enhance } from '$app/forms';
	import FavoriteOutlinedIcon from '@material-symbols/svg-400/sharp/favorite.svg?component';
	import FavoriteIcon from '@material-symbols/svg-400/sharp/favorite-fill.svg?component';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		if (page.url.searchParams.get('showToast') === 'clone-success')
			showToast('success', { text: 'Successfully cloned workout' });
	});

	const username = (data.workout?.profile as unknown as { username: string }).username;

	async function handleDeleteWorkout() {
		const res = await fetch(`/workouts/${data.workout.id}`, { method: 'DELETE' });
		if (res.ok) {
			showToast('success', { text: 'Successfully deleted workout' });
			goto('/');
		} else showToast('error', { text: 'Failed to delete workout' });
	}

	let cloning = $state(false);
	let liking = $state(false);

	$inspect(data.liked);
	$inspect(data.likes);
</script>

<div class="workout">
	<div class="workout__info">
		{#if data.workout?.creation_date}
			<small>
				Created on {new Date(data.workout?.creation_date).toLocaleDateString()}
			</small>
		{/if}
		<h1>{data.workout?.name}</h1>
		<small>
			Created by <a href={`/profile/${username}`}>{username}</a>
			{#if data.workout?.based_on}
				<br />
				Based on
				<a href={`/workouts/${data.workout?.based_on?.id}`}>{data.workout?.based_on?.name}</a>
			{/if}
		</small>
		<p>{data.workout?.description}</p>
		<div class="workout__actions">
			{#if data.editable}
				<a class="link" href={`/workouts/${data.workout?.id}/edit`}>Edit</a>
			{/if}
			<form
				method="POST"
				action="?/clone"
				use:enhance={() => {
					cloning = true;
					return async ({ result }) => {
						cloning = false;
						if (result.type === 'error') return showToast('error', { text: result.error });
						else if (result.type === 'redirect') {
							showToast('success', { text: 'Successfully cloned workout' });
							goto(result.location);
						}
					};
				}}
			>
				<Button variant="text" loading={cloning}>Clone</Button>
			</form>
			<Button
				variant="text"
				onclick={() => replaceState('', { modalShown: 'confirm-delete-workout' })}
			>
				Delete
			</Button>
		</div>
		<form
			method="POST"
			action="?/like"
			use:enhance={() => {
				liking = true;
				return async ({ result }) => {
					liking = false;
					if (result.type === 'error') return showToast('error', { text: result.error });
					invalidate('supabase:likes');
					data.liked = !data.liked;
					data.likes += data.liked ? 1 : -1;
				};
			}}
		>
			<input type="hidden" name="liked" value={data.liked} />
			<Button class="workout__like" variant="text" disabled={liking}>
				{@const Icon = data.liked ? FavoriteIcon : FavoriteOutlinedIcon}
				<Icon style="fill: var(--color-primary);" width={16} height={16} />
				{data.likes} Likes
			</Button>
		</form>
	</div>

	<div class="workout__exercise-list">
		<h2>Exercises</h2>
		{#each data.workout?.exercises ?? [] as exercise}
			<ExerciseListItem exercise={exercise as WorkoutExercise} />
		{/each}
	</div>
</div>

<ConfirmationDialog
	open={page.state.modalShown === 'confirm-delete-workout'}
	title={`Are you sure you want to delete ${data.workout.name}?`}
	message="This workout will be permanently removed and cannot be recovered."
	confirmLabel="Delete"
	oncancel={() => replaceState('', { modalShown: undefined })}
	onconfirm={handleDeleteWorkout}
/>

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
		align-items: center;
	}

	:global(.workout__like) {
		display: flex;
		gap: var(--base-spacing);
	}
</style>
