<script lang="ts" generics="Item">
	import { type Snippet } from 'svelte';
	import debounce from 'lodash.debounce';

	type AutocompleteProps = {
		loadFunction: (query: string) => Promise<Item[]>;
		name?: string;
		valueSnippet?: Snippet<[Item]>;
		debounceValue?: number;
		searchThreshold?: number;
		value?: Item;
	};

	let {
		loadFunction,
		valueSnippet,
		debounceValue = 300,
		name = '',
		searchThreshold = 3,
		value = $bindable()
	}: AutocompleteProps = $props();
	let query = $state('');
	let inputValue = $state('');
	let result: Item[] = $state([]);
	let loading: boolean = $state(false);

	const updateQuery = debounce((q: string) => (query = q), debounceValue);

	$effect(() => {
		updateQuery(inputValue);
	});

	$effect(() => {
		if (query.length >= searchThreshold) {
			loading = true;
			loadFunction(query)
				.then((data) => (result = data))
				.finally(() => (loading = false));
		}
	});

	const clear = () => {
		console.log('clear');
		value = undefined;
		result = [];
	};
</script>

<div class="autocomplete">
	<input
		type="text"
		role="combobox"
		aria-controls="listbox"
		aria-expanded={value === undefined}
		{name}
		bind:value={inputValue}
		placeholder="Search..."
		readonly={value !== undefined}
	/>
	{#if value}
		{#if valueSnippet}{@render valueSnippet(value)}{:else}{value}{/if}
		<button type="button" onclick={clear}>x</button>
	{/if}
	{#if loading}o{/if}
	<ul role="listbox" hidden={value !== undefined}>
		{#each result as item}
			<button
				role="option"
				type="button"
				aria-selected={value === item}
				onclick={() => (value = item)}>{item}</button
			>
		{/each}
	</ul>
</div>
