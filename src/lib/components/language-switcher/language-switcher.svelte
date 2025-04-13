<script lang="ts">
	import { locales, getLocale, setLocale } from '$lib/paraglide/runtime';
	import { cn } from '$lib/utils';
	import { Toggle } from '../toggle';

	const { class: className }: { class?: string } = $props();

	const localeLabel = (locale: (typeof locales)[number]) => {
		if (locale === 'en') return 'EN';
		if (locale === 'pt-br') return 'PT';
	};
</script>

<div class={cn(className, 'flex')}>
	{#each locales as lang, index (lang)}
		<Toggle
			pressed={getLocale() === lang}
			onPressedChange={() => setLocale(lang)}
			class={cn('w-full', {
				'rounded-l-none': index !== 0,
				'rounded-r-none': index !== locales.length - 1
			})}
			size="sm"
		>
			{localeLabel(lang)}
		</Toggle>
	{/each}
</div>
