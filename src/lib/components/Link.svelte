<script lang="ts" module>
	export type LinkProps = {
		href: string;
		exact?: boolean;
		children?: Snippet<[active?: boolean]>;
	} & Omit<HTMLAnchorAttributes, 'children'>;
</script>

<script lang="ts">
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	const { href, children, exact = true, ...rest }: LinkProps = $props();

	let active = $state(false);

	$effect(() => {
		if (exact)
			active = [page.url.pathname, `${page.url.pathname}/`].includes(i18n.resolveRoute(href));
		else active = page.url.pathname.includes(href);
	});
</script>

<a {href} {...rest} class:active>
	{@render children?.(active)}
</a>

<style>
	.link {
		cursor: pointer;
		color: var(--color-primary);
		font-weight: 500;
		text-transform: uppercase;
		text-decoration: none;
		font-size: 0.7rem;
		transition: all 0.2s ease-in-out;
	}

	.link:is(:focus, .active) {
		outline: none;
		color: var(--color-background);
		background-color: var(--color-primary);
	}
</style>
