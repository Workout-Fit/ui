<script lang="ts">
	import {
		availableLanguageTags,
		languageTag,
		type AvailableLanguageTag
	} from '$lib/paraglide/runtime.js';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Select, SelectTrigger, SelectItem, SelectContent } from '../select';
</script>

<Select
	type="single"
	value={languageTag()}
	onValueChange={(value) =>
		goto(i18n.resolveRoute(i18n.route(page.url.pathname), value as AvailableLanguageTag))}
>
	<SelectTrigger class="w-20">{languageTag()}</SelectTrigger>
	<SelectContent>
		{#each availableLanguageTags as lang (lang)}
			<SelectItem value={lang}>{lang}</SelectItem>
		{/each}
	</SelectContent>
</Select>
