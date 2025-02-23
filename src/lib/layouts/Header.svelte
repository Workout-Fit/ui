<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import Link from '$lib/components/Link.svelte';
	import { Logo } from '$lib/components/ui/logo';
	import * as m from '$lib/paraglide/messages';

	let { username }: { username?: string } = $props();
</script>

<header class="flex items-center justify-between py-4">
	<Link class="bg-transparent" href="/">
		{#snippet children(active)}
			<Logo width={32} {active} />
		{/snippet}
	</Link>
	<nav class="flex justify-between gap-4">
		<LanguageSwitcher />
		{#if username}
			<Link class="link" exact={false} href={`/profile/${username}`}>{m.profile()}</Link>
			<form method="POST" class="inline-flex" action="/?/signout" use:enhance>
				<Button variant="link" class="p-0">{m.sign_out()}</Button>
			</form>
		{:else}
			<Link class="link" href="/auth">{m.sign_in()}</Link>
		{/if}
	</nav>
</header>
