<script lang="ts">
	import WorkoutList from '$lib/layouts/WorkoutList.svelte';
	import type { PageServerData } from './$types';
	import emptyProfilePicture from '$lib/assets/img/empty_ppic.webp';
	import { Button } from '$lib/components/button';
	import { m } from '$lib/paraglide/messages';
	import { Avatar, AvatarImage } from '$lib/components/avatar';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="flex flex-col items-center gap-2">
	<Avatar class="size-32">
		<AvatarImage src={data.profile.avatar ?? emptyProfilePicture} alt="" />
	</Avatar>
	<div class="flex flex-col items-center">
		<h2 class="m-0 text-2xl font-bold">
			{data.profile.full_name}
			{#if data.editable}
				<Button
					variant="ghost"
					data-sveltekit-replacestate
					href={`/profile/${data.profile.username}/edit`}
				>
					{m.edit()}
				</Button>
			{/if}
		</h2>
		<small>@{data.profile.username}</small>
	</div>
	{#if data.profile.weight || data.profile.height}
		<div class="flex gap-8">
			{#if data.profile.weight}<span>{data.profile.weight} <small>kg</small></span>{/if}
			{#if data.profile.height}<span>{data.profile.height / 100} <small>m</small></span>{/if}
		</div>
	{/if}
	{#if data.profile.bio}
		<p>{data.profile.bio}</p>
	{:else}
		<i>{m.empty_bio()}</i>
	{/if}

	<WorkoutList workouts={data.workouts}>
		{#snippet action()}
			{#if data.editable}
				<Button href="/new">+ {m.create_workout()}</Button>
			{/if}
		{/snippet}
	</WorkoutList>
</div>
