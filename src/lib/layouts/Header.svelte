<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import Link from '$lib/components/Link.svelte';
	import { Logo } from '$lib/components/ui/logo';
	import * as m from '$lib/paraglide/messages';

	let { username }: { username?: string } = $props();
</script>

<header>
	<Link class="logo" href="/">
		{#snippet children(active)}
			<Logo width={32} {active} />
		{/snippet}
	</Link>
	<nav>
		<LanguageSwitcher />
		{#if username}
			<Link class="link" exact={false} href={`/profile/${username}`}>{m.profile()}</Link>
			<form method="POST" action="/?/signout" use:enhance>
				<Button variant="link">{m.sign_out()}</Button>
			</form>
		{:else}
			<Link class="link" href="/auth">{m.sign_in()}</Link>
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

	:global(.logo:focus) {
		background: none;
	}
</style>
