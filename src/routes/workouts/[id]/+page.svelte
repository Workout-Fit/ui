<script lang="ts">
	import ExerciseListItem from '$lib/layouts/ExerciseListItem.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/button';
	import {
		AlertDialog,
		AlertDialogContent,
		AlertDialogHeader,
		AlertDialogTitle,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogCancel,
		AlertDialogAction
	} from '$lib/components/alert-dialog';
	import { invalidate, replaceState } from '$app/navigation';
	import { enhance } from '$app/forms';
	import FavoriteOutlinedIcon from '@material-symbols/svg-400/sharp/favorite.svg?component';
	import FavoriteIcon from '@material-symbols/svg-400/sharp/favorite-fill.svg?component';
	import { Link } from '$lib/components/link';
	import { List } from '$lib/components/list';
	import { m } from '$lib/paraglide/messages';

	let { data }: { data: PageData } = $props();

	const username = (data.workout.profile as unknown as { username: string }).username;

	let deleting = $state(false);
	let cloning = $state(false);
	let liking = $state(false);
</script>

<div>
	<div>
		{#if data.workout?.creation_date}
			<small>
				{m.created_on()}{` ${new Date(data.workout?.creation_date).toLocaleDateString()}`}
			</small>
		{/if}
		<h1 class="text-4xl font-bold">{data.workout?.name}</h1>
		<small>
			{m.created_by()}
			<Link href={`/profile/${username}`}>{username}</Link>
			{#if data.workout?.based_on}
				<br />
				{m.based_on()}
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
					return async ({ update }) => {
						await update();
						cloning = false;
					};
				}}
			>
				<Button type="submit" variant="ghost" disabled={cloning}>{m.clone()}</Button>
			</form>
			{#if data.editable}
				<Button
					data-sveltekit-replacestate
					variant="ghost"
					href={`/workouts/${data.workout?.id}/edit`}
				>
					{m.edit()}
				</Button>
				<Button
					variant="ghost"
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
				return async ({ result, update }) => {
					await update();
					liking = false;
					if (result.type === 'error') toast.error(result.error);
					else if (result.type === 'success') {
						invalidate('supabase:likes');
						data.liked = !data.liked;
						data.likes += data.liked ? 1 : -1;
					}
				};
			}}
		>
			<input type="hidden" name="liked" value={data.liked} />
			<Button type="submit" variant="ghost" disabled={liking} class="flex gap-2">
				{@const Icon = data.liked ? FavoriteIcon : FavoriteOutlinedIcon}
				<Icon class="fill-primary" width={16} height={16} />
				{data.likes}
				{m.likes()}
			</Button>
		</form>
	</div>

	<div class="mt-8">
		<h2 class="text-2xl font-bold">{m.exercises()}</h2>
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
			<form
				method="POST"
				action="?/delete"
				use:enhance={() => {
					deleting = true;
					return async ({ update }) => {
						await update();
						deleting = false;
					};
				}}
			>
				<AlertDialogAction class="w-full" loading={deleting}>
					{m.delete_action()}
				</AlertDialogAction>
			</form>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
