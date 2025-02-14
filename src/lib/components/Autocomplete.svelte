<script lang="ts" generics="Item">
	import { onMount, type Snippet } from 'svelte';
	import debounce from 'lodash/debounce';
	import Button from './Button.svelte';
	import { on } from 'svelte/events';
	import CircularProgress from './CircularProgress.svelte';

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
	// svelte-ignore non_reactive_update
	let input: HTMLInputElement;

	const updateQuery = debounce((q: string) => (query = q), debounceValue);

	const clear = () => {
		inputValue = '';
		value = undefined;
	};

	$effect(() => {
		updateQuery(inputValue);
	});

	$effect(() => {
		if (inputValue === '') result = [];
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
		if (input.form) {
			const inputHandlerRemove = on(
				input.form as HTMLFormElement,
				'formdata',
				({ formData }: FormDataEvent) => {
					if (value) formData.append(name, JSON.stringify(value));
				}
			);

			return inputHandlerRemove;
		}
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
			<Button type="button" onclick={clear} aria-label="clear" variant="text">×</Button>
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
		{#if loading}<CircularProgress color="primary" />{/if}
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
					inputValue = '';
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

		height: 38px;
	}

	input {
		padding: 0;
		border: 0;
		background: none;
		font-size: medium;
		color: var(--text-high);
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
		z-index: 1;
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

	label {
		font-size: small;
	}
</style>
