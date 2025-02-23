<script lang="ts">
	import ExerciseListItem from '$lib/components/ExerciseListItem.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import { toast } from 'svelte-french-toast';
	import { Button } from '$lib/components/ui/button';
	import {
		AlertDialog,
		AlertDialogContent,
		AlertDialogHeader,
		AlertDialogTitle,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogCancel,
		AlertDialogAction,
		AlertDialogPortal
	} from '$lib/components/ui/alert-dialog';
	import { goto, invalidate, replaceState } from '$app/navigation';
	import { enhance } from '$app/forms';
	import FavoriteOutlinedIcon from '@material-symbols/svg-400/sharp/favorite.svg?component';
	import FavoriteIcon from '@material-symbols/svg-400/sharp/favorite-fill.svg?component';
	import Link from '$lib/components/Link.svelte';
	import List from '$lib/components/List.svelte';
	import * as m from '$lib/paraglide/messages';
	import { languageTag } from '$lib/paraglide/runtime';
	import AlertDialogOverlay from '$lib/components/ui/alert-dialog/alert-dialog-overlay.svelte';

	let { data }: { data: PageData } = $props();

	const username = (data.workout.profile as unknown as { username: string }).username;

	async function handleDeleteWorkout() {
		const res = await fetch(`/api/workouts/${data.workout.id}`, { method: 'DELETE' });
		if (res.ok) {
			toast.success(m.workout_delete_success());
			goto('/');
		} else toast.error(m.workout_delete_error());
	}

	let cloning = $state(false);
	let liking = $state(false);
</script>

<div class="workout">
	<div class="workout__info">
		{#if data.workout?.creation_date}
			<small>
				{m.created_on()}{' '}{new Date(data.workout?.creation_date).toLocaleDateString()}
			</small>
		{/if}
		<h1>{data.workout?.name}</h1>
		<small>
			{m.created_by()}{' '}<Link href={`/profile/${username}`}>{username}</Link>
			{#if data.workout?.based_on}
				<br />
				{m.based_on()}{' '}
				<Link href={`/workouts/${data.workout?.based_on?.id}`}>{data.workout?.based_on?.name}</Link>
			{/if}
		</small>
		<p>{data.workout?.notes}</p>
		<div class="flex items-center gap-4">
			<form
				method="POST"
				class="inline-flex"
				action="?/clone"
				use:enhance={() => {
					cloning = true;
					return async ({ result, update }) => {
						await update();
						cloning = false;
						if (result.type === 'error') toast.error(result.error);
						else if (result.type === 'redirect') {
							if (result.status === 307) {
								toast.error(
									m.demand_sign_in({
										action: languageTag() === 'en' ? 'clone a workout' : 'clonar uma ficha'
									})
								);
								goto(result.location);
							} else {
								toast.success(m.workout_clone_success());
								goto(result.location);
							}
						}
					};
				}}
			>
				<Button variant="link" disabled={cloning}>{m.clone()}</Button>
			</form>
			{#if data.editable}
				<Link class="link" href={`/workouts/${data.workout?.id}/edit`}>{m.edit()}</Link>
				<Button
					variant="link"
					onclick={() => replaceState('', { modalShown: 'confirm-delete-workout' })}
				>
					{m.delete_action()}
				</Button>
			{/if}
		</div>
		<form
			method="POST"
			action="?/like"
			use:enhance={() => {
				liking = true;
				return async ({ result }) => {
					liking = false;
					if (result.type === 'redirect') {
						toast.error(
							m.demand_sign_in({
								action: languageTag() === 'en' ? 'like a workout' : 'curtir uma ficha'
							})
						);
						console.log(result);
						return goto(result.location);
					} else if (result.type === 'error') toast.error(result.error);
					else {
						invalidate('supabase:likes');
						data.liked = !data.liked;
						data.likes += data.liked ? 1 : -1;
					}
				};
			}}
		>
			<input type="hidden" name="liked" value={data.liked} />
			<Button variant="link" disabled={liking}>
				{@const Icon = data.liked ? FavoriteIcon : FavoriteOutlinedIcon}
				<Icon class="fill-primary" width={16} height={16} />
				{data.likes}
				{m.likes()}
			</Button>
		</form>
	</div>

	<div class="mt-8">
		<h2>{m.exercises()}</h2>
		<List items={data.workout?.exercises} emptyMessage={m.exercise_list_empty()}>
			{#snippet item(exercise)}
				<ExerciseListItem {exercise} />
			{/snippet}
		</List>
	</div>
</div>

<AlertDialog
	open={page.state.modalShown === 'confirm-delete-workout'}
	onOpenChange={(open) => {
		if (!open) replaceState('', { modalShown: undefined });
	}}
>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>
				{m.delete_workout_confirmation_title({ workout: data.workout?.name })}
			</AlertDialogTitle>
			<AlertDialogDescription>{m.delete_workout_confirmation_message()}</AlertDialogDescription>
		</AlertDialogHeader>
		<AlertDialogFooter>
			<AlertDialogCancel>Cancel</AlertDialogCancel>
			<AlertDialogAction onclick={handleDeleteWorkout}>{m.delete_action()}</AlertDialogAction>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
