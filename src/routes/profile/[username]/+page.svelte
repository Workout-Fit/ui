<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="profile">
	{#if data.editable}
		<a href={`/profile/${data.profile.username}/edit`}>
			<button>Edit</button>
		</a>
	{/if}
	<img src={data.profile.avatar_url} alt="" />
	<h2>{data.profile.full_name}</h2>
	<small>@{data.profile.username}</small>
	{#if data.profile.weight || data.profile.height}
		<div class="profile__body-composition">
			<h3>Body Composition</h3>
			{#if data.profile.weight}<p>Weight: {data.profile.weight} kg</p>{/if}
			{#if data.profile.height}<p>Height: {data.profile.height} cm</p>{/if}
		</div>
	{/if}
</div>
