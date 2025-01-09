<script lang="ts">
	import { enhance } from '$app/forms';
	import Logo from '$lib/components/Logo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { username }: { username?: string } = $props();

	$inspect(username);
</script>

<header>
	<a class="button button--text" href="/">
		<Logo width={32} />
	</a>
	<nav>
		<ThemeToggle />
		<a class="button button--text" href={`/profile/${username}`}>Profile</a>
		<form method="POST" action="/?/signout" use:enhance>
			<button class="button button--text">Sign-out</button>
		</form>
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
	}
</style>
