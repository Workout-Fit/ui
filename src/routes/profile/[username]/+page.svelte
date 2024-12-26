<script lang="ts">
	import WorkoutListItem from '$lib/components/WorkoutListItem.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="profile">
	{#if data.editable}
		<a href={`/profile/${data.profile.username}/edit`}>
			<button>Edit</button>
		</a>
	{/if}
	<img class="profile__avatar" src={data.profile.avatar_url} alt="" />
	<div class="profile__info">
		<h2 class="profile__fullname">{data.profile.full_name}</h2>
		<small>@{data.profile.username}</small>
	</div>
	{#if data.profile.weight || data.profile.height}
		<div class="profile__body-composition">
			{#if data.profile.weight}<span>{data.profile.weight} <small>kg</small></span>{/if}
			{#if data.profile.height}<span>{data.profile.height} <small>cm</small></span>{/if}
		</div>
	{/if}
	{#if data.profile.bio}
		<p>{data.profile.bio}</p>
	{:else}
		<i>No bio available</i>
	{/if}

	<h3>Workouts</h3>
	<div class="profile__workouts">
		{#if data.workouts.length === 0}
			<p>No workouts available</p>
		{:else}
			{#each data.workouts as workout}<WorkoutListItem {workout} />{/each}
		{/if}
	</div>
</div>

<style>
	.profile {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--base-spacing);
	}

	.profile__fullname {
		margin: 0;
	}

	.profile__avatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
	}

	.profile__body-composition {
		display: flex;
		gap: calc(var(--base-spacing) * 4);
	}

	.profile__body-composition > span {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.profile__body-composition small {
		font-size: 0.8rem;
		font-weight: normal;
	}

	.profile__workouts {
		width: 100%;
	}

	.profile__info {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
