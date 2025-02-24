<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import Link from '$lib/components/Link.svelte';
	import DarkMode from '@material-symbols/svg-400/sharp/dark_mode.svg?component';
	import LightMode from '@material-symbols/svg-400/sharp/light_mode.svg?component';
	import { Logo } from '$lib/components/ui/logo';
	import * as m from '$lib/paraglide/messages';
	import { toggleMode } from 'mode-watcher';

	let { username }: { username?: string } = $props();
</script>

<header class="flex items-center justify-between py-4">
	<Link class="bg-transparent" href="/">
		{#snippet children(active)}
			<Logo width={56} {active} />
		{/snippet}
	</Link>
	<nav class="flex justify-between gap-4">
		<LanguageSwitcher />
		<Button onclick={toggleMode} variant="ghost" size="icon">
			<LightMode
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 fill-primary transition-all dark:-rotate-90 dark:scale-0"
			/>
			<DarkMode
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 fill-primary transition-all dark:rotate-0 dark:scale-100"
			/>
		</Button>
		{#if username}
			<Link class="link" exact={false} href={`/profile/${username}`}>{m.profile()}</Link>
			<form method="POST" class="inline-flex" action="/?/signout" use:enhance>
				<Button variant="link" type="submit" class="p-0">{m.sign_out()}</Button>
			</form>
		{:else}
			<Link class="link" href="/auth">{m.sign_in()}</Link>
		{/if}
	</nav>
</header>
