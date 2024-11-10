<script lang="ts" generics="Item">
	import { onMount, type Snippet } from 'svelte';
	import debounce from 'lodash.debounce';

	type AutocompleteProps = {
		loadFunction: (query: string) => Promise<Item[]>;
		id?: string;
		name?: string;
		renderValue: Snippet<[Item]>;
		renderItem: Snippet<[Item]>;
		debounceValue?: number;
		searchThreshold?: number;
		value?: Item;
		disabled?: boolean;
	};

	let {
		loadFunction,
		renderValue: valueSnippet,
		renderItem: itemSnippet,
		debounceValue = 300,
		name = '',
		searchThreshold = 3,
		id,
		disabled,
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
	<div
		class="autocomplete__input"
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
			<button type="button" class="button--text" onclick={clear}>x</button>
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
				readonly={value !== undefined}
			/>
		{/if}
		{#if loading}o{/if}
	</div>
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
	}

	.autocomplete[aria-disabled='true'] {
		pointer-events: none;
		opacity: 0.5;
	}

	.autocomplete__input {
		--input-border: rgb(118, 118, 118);
		padding: 1px 2px;
		border: 1px inset var(--input-border);
		display: flex;
		gap: var(--base-spacing);
		align-items: center;
		justify-content: space-between;
		font-size: 0.7rem;
		height: 21px;
		border-radius: 2px;
	}

	.autocomplete__input:focus,
	.autocomplete__input--focused {
		outline: black solid 1px;
	}

	input {
		padding: none;
		border: none;
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
		max-height: 5rem;
		overflow-y: auto;
		background: white;
		width: 100%;
	}

	.autocomplete__options > li {
		padding: var(--base-spacing);
		cursor: pointer;
		font-size: 0.7rem;
		list-style: none;
	}

	.autocomplete__options > li:hover {
		background-color: var(--color-primary-lightest);
	}

	.autocomplete__options--hidden {
		display: none;
	}
</style>
