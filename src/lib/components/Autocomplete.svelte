<script lang="ts" generics="Item">
	import { onMount, type Snippet } from 'svelte';
	import debounce from 'lodash/debounce';

	type AutocompleteProps = {
		loadFunction: (query: string) => Promise<Item[]>;
		id?: string;
		name?: string;
		error?: string;
		renderValue: Snippet<[Item]>;
		renderItem: Snippet<[Item]>;
		debounceValue?: number;
		searchThreshold?: number;
		value?: Item;
		disabled?: boolean;
		label?: string;
	};

	let {
		loadFunction,
		renderValue: valueSnippet,
		renderItem: itemSnippet,
		debounceValue = 300,
		name = '',
		searchThreshold = 3,
		id,
		label,
		disabled,
		error,
		value = $bindable()
	}: AutocompleteProps = $props();
	let query = $state('');
	let inputValue = $state('');
	let result: Item[] = $state([]);
	let loading: boolean = $state(false);
	let openDropdown = $state(false);
	let inputFocused = $state(false);
	let input: HTMLInputElement | undefined = $state();

	const updateQuery = debounce((q: string) => (query = q), debounceValue);

	const clear = () => {
		inputValue = '';
		result = [];
		value = undefined;
	};

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

	$effect(() => {
		openDropdown = result.length > 0 && !value;
	});

	onMount(() => {
		const handleFormData = ({ formData }: FormDataEvent) => {
			if (value) formData.append(name, JSON.stringify(value));
		};

		input?.form?.addEventListener('formdata', handleFormData);

		return () => {
			input?.form?.removeEventListener('formdata', handleFormData);
		};
	});
</script>

<div class="autocomplete" aria-disabled={disabled}>
	<label for={id}>{label}</label>
	<div
		class="autocomplete__input input"
		role="combobox"
		aria-expanded={openDropdown}
		aria-controls="listbox"
		aria-haspopup="listbox"
		class:autocomplete__input--focused={inputFocused}
		tabindex="0"
		onfocus={() => (openDropdown = true)}
		onblur={() => (openDropdown = false)}
	>
		{#if value}
			<div class="autocomplete__value">
				{@render valueSnippet(value)}
			</div>
			<button type="button" class="button--text" onclick={clear} aria-label="clear">×</button>
		{:else}
			<input
				bind:this={input}
				onblur={() => {
					inputFocused = false;
					openDropdown = false;
				}}
				onfocus={() => {
					inputFocused = true;
					openDropdown = result.length > 0 && !value;
				}}
				type="text"
				autocomplete="off"
				aria-autocomplete="list"
				{name}
				{id}
				bind:value={inputValue}
				placeholder="Search..."
				readonly={value != null}
			/>
		{/if}
		{#if loading}o{/if}
	</div>
	{#if error}<span class="autocomplete__error">{error}</span>{/if}
	<ul
		class="autocomplete__options"
		class:autocomplete__options--hidden={!openDropdown}
		role="listbox"
	>
		{#each result as item}
			<li
				onkeydown={() => undefined}
				role="option"
				aria-selected={value === item}
				onmousedown={(e) => {
					e.stopPropagation();
					value = item;
				}}
			>
				{@render itemSnippet(item)}
			</li>
		{/each}
	</ul>
</div>

<style>
	.autocomplete {
		position: relative;
		width: 100%;
	}

	.autocomplete[aria-disabled='true'] {
		pointer-events: none;
		opacity: 0.5;
	}

	.autocomplete__input {
		display: flex;
		gap: var(--base-spacing);
		align-items: center;
		justify-content: space-between;
	}

	.autocomplete__input:focus,
	.autocomplete__input--focused {
		outline: black inset 2px;
	}

	input {
		padding: 0;
		border: 0;
		background: none;
		width: 100%;
	}

	input:focus {
		outline: none;
	}

	.autocomplete__options {
		position: absolute;
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		border: 1px solid var(--input-border);
		max-height: 7rem;
		overflow-y: auto;
		margin-top: var(--base-spacing);
		width: 100%;
		border-radius: 4px;
		background-color: var(--color-background);
	}

	.autocomplete__options > li {
		padding: var(--base-spacing);
		cursor: pointer;
		font-size: 0.9rem;
		color: var(--color-foreground);
		list-style: none;
	}

	.autocomplete__options > li:hover {
		background-color: var(--text-lowest);
	}

	.autocomplete__options--hidden {
		display: none;
	}

	.autocomplete__error {
		color: red;
		font-size: 0.7rem;
		opacity: 0.87;
	}
</style>
