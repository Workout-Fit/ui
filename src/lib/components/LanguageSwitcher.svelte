<script lang="ts">
	import {
		availableLanguageTags,
		languageTag,
		type AvailableLanguageTag
	} from '$lib/paraglide/runtime.js';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Select from './Select.svelte';
</script>

<Select
	value={languageTag()}
	onchange={(e) =>
		goto(
			i18n.resolveRoute(
				i18n.route(page.url.pathname),
				(e.target as HTMLSelectElement).value as AvailableLanguageTag
			)
		)}
>
	{#each availableLanguageTags as lang}
		<option value={lang}>{lang}</option>
	{/each}
</Select>
