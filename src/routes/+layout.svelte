<script lang="ts">
	import '../app.css';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';

	import { invalidate } from '$app/navigation';
	import { onMount, setContext, type ComponentType, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Header from '$lib/layouts/Header.svelte';
	import { browser } from '$app/environment';
	import { ProgressBar } from '@prgm/sveltekit-progress-bar';
	import { pwaInfo } from 'virtual:pwa-info';
	import { toast } from 'svelte-sonner';

	import { on } from 'svelte/events';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import UpdateToast from '$lib/components/UpdateToast.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	let { session, supabase } = data;

	const serviceWorker = useRegisterSW();
	const { needRefresh } = serviceWorker;
	let updateToastId = $state<number | string | null>(null);

	setContext('service-worker', serviceWorker);

	onMount(() => {
		let formEventHandlerRemove: () => void;
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) invalidate('supabase:auth');
		});

		if (browser)
			formEventHandlerRemove = on(document, 'keydown', (e: KeyboardEvent) => {
				if (!(e.key === 'Enter' && (e.metaKey || e.ctrlKey)) || !e.target) return;

				if ('form' in e.target) {
					const formElement = e.target.form as HTMLFormElement;
					formElement?.requestSubmit();
				}
			});

		return () => {
			data.subscription.unsubscribe();
			formEventHandlerRemove();
		};
	});

	$effect(() => {
		if ($needRefresh) updateToastId = toast(UpdateToast as any);
		else if (updateToastId) toast.dismiss(updateToastId);
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html pwaInfo?.webManifest?.linkTag ?? ''}
</svelte:head>

<ProgressBar color="var(--color-primary);" />

<Toaster />

<ModeWatcher defaultMode="dark" />
<ParaglideJS {i18n}>
	<div class="m-auto box-border flex min-h-screen max-w-5xl flex-col p-4">
		<Header username={data.username ?? undefined} />
		{@render children()}
	</div>
</ParaglideJS>
