<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, buttonVariants } from '$lib/components/button';
	import { LanguageSwitcher } from '$lib/components/language-switcher';
	import { Link } from '$lib/components/link';
	import DarkMode from '@material-symbols/svg-400/sharp/dark_mode.svg?component';
	import LightMode from '@material-symbols/svg-400/sharp/light_mode.svg?component';
	import { Logo } from '$lib/components/logo';
	import { m } from '$lib/paraglide/messages';
	import { toggleMode } from 'mode-watcher';
	import emptyProfilePicture from '$lib/assets/img/empty_ppic.webp';
	import { cn } from '$lib/utils';
	import Avatar from '$lib/components/avatar/avatar.svelte';
	import { AvatarImage } from '$lib/components/avatar';
	import {
		DropdownMenu,
		DropdownMenuGroup,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuItem
	} from '$lib/components/dropdown-menu';

	let { username, avatar }: { username?: string; avatar?: string } = $props();
</script>

<header class="flex items-center justify-between py-4">
	<Link class={cn('bg-transparent', buttonVariants({ variant: 'icon' }))} href="/">
		{#snippet children(active)}
			<Logo
				class="transition-[filter] duration-300 hover:invert focus:invert"
				{active}
				width={50}
			/>
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
			<DropdownMenu>
				<DropdownMenuTrigger aria-label={m.account_menu()}>
					<Avatar>
						<AvatarImage src={avatar ?? emptyProfilePicture} alt="" />
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent collisionPadding={16}>
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<Link exact={false} href={`/profile/${username}`}>
								{m.profile()}
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<form method="POST" action="/?/signout" use:enhance>
								<Button variant="ghost" type="submit" class="p-0">{m.sign_out()}</Button>
							</form>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		{:else}
			<Link class="link" href="/auth">{m.sign_in()}</Link>
		{/if}
	</nav>
</header>
