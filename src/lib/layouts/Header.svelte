<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { username }: { username?: string } = $props();
</script>

<header>
	<a class="link" href="/">
		<Logo width={32} />
	</a>
	<nav>
		<ThemeToggle />
		{#if username}
			<a class="link" href={`/profile/${username}`}>Profile</a>
			<form method="POST" action="/?/signout" use:enhance>
				<Button variant="text">Sign-out</Button>
			</form>
		{:else}
			<a class="link" href="/auth">Sign-in</a>
		{/if}
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: calc(var(--base-spacing) * 2) 0;
	}

	nav {
		color: var(--color-primary);
		display: flex;
		gap: 1rem;
		align-items: center;
	}
</style>
