<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<header>
	<a href="/" class="logo">
		<Logo width={32} />
	</a>
	<nav>
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

	.logo {
		color: var(--text-high);
		text-decoration: none;
	}

	nav {
		color: var(--color-primary);
		display: flex;
		gap: 1rem;
	}

	h2 {
		margin: 0;
	}
</style>
