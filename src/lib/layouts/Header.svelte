<script>
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<header>
	<h2 class="logo">Workout</h2>
	<nav>
		<a href="/">Home</a>
		<a href="/workouts">Workouts</a>
		<ThemeToggle />
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: calc(var(--base-spacing) * 2);
	}

	.logo {
		color: var(--text-high);
	}

	nav {
		color: var(--color-primary);
		display: flex;
		gap: 1rem;
	}
</style>
