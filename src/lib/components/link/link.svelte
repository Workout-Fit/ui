<script lang="ts" module>
	export type LinkProps = {
		href: string;
		exact?: boolean;
		children?: Snippet<[active?: boolean]>;
	} & Omit<HTMLAnchorAttributes, 'children'>;
</script>

<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { buttonVariants } from '../button';
	import { cn } from '$lib/utils';
	import { deLocalizeHref } from '$lib/paraglide/runtime';

	const { href, children, exact = true, class: className, ...rest }: LinkProps = $props();

	let active = $state(false);

	$effect(() => {
		if (exact) active = [page.url.pathname, `${page.url.pathname}/`].includes(deLocalizeHref(href));
		else active = page.url.pathname.includes(href);
	});
</script>

<a {href} {...rest} class={cn(buttonVariants({ variant: 'ghost' }), 'rounded-none p-0', className)}>
	{@render children?.(active)}
</a>
