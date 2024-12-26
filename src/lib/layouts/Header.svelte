<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	const { username }: { username?: string } = $props();
</script>

<header>
	<Logo width={32} />
	<nav>
		<a class="button button--text" href="/">Workouts</a>
		{#if username}<a class="button button--text" href={`profile/${username}`}>Profile</a>{/if}
		<ThemeToggle />
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
