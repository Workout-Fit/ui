<script lang="ts">
	import { locales, getLocale, setLocale } from '$lib/paraglide/runtime';
	import { Select, SelectTrigger, SelectItem, SelectContent } from '../select';
</script>

<Select
	type="single"
	value={getLocale()}
	onValueChange={(value) => setLocale(value as 'en' | 'pt-br')}
>
	<SelectTrigger class="w-20">{getLocale()}</SelectTrigger>
	<SelectContent>
		{#each locales as lang (lang)}
			<SelectItem value={lang}>{lang}</SelectItem>
		{/each}
	</SelectContent>
</Select>
