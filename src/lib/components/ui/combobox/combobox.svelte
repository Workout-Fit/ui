<script lang="ts" generics="Item">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import ChevronsUp from 'lucide-svelte/icons/chevrons-up';
	import { Combobox } from 'bits-ui';
	import debounce from 'lodash/debounce';
	import CircularProgress from '$lib/components/CircularProgress.svelte';
	import FormLabel from '../form/form-label.svelte';

	type AutocompleteProps = {
		loadFunction: (query: string) => Promise<Item[]>;
		id?: string;
		name?: string;
		debounceValue?: number;
		searchThreshold?: number;
		getItemValue: (item: Item) => string;
		getItemLabel?: (item: Item) => string;
		value?: Item;
		disabled?: boolean;
		label?: string;
		placeholder?: string;
		emptyMessage?: string;
	};

	let {
		loadFunction,
		getItemValue,
		getItemLabel = getItemValue,
		emptyMessage,
		placeholder = '',
		debounceValue,
		name,
		label,
		id,
		searchThreshold = 3,
		value = $bindable(),
		disabled
	}: AutocompleteProps = $props();

	let inputValue = $state('');
	let loading = $state(false);
	let open = $state(false);
	let results = $state<Item[]>([]);
	let query = $state('');

	const updateQuery = debounce((q: string) => (query = q), debounceValue);

	$effect(() => {
		updateQuery(inputValue);
	});

	$effect(() => {
		if (query.length >= searchThreshold) {
			loading = true;
			loadFunction(query)
				.then((data) => (results = data))
				.finally(() => (loading = false));
		}
	});
</script>

<Combobox.Root
	bind:open
	{disabled}
	type="single"
	{name}
	onValueChange={(val: string) => {
		value = results.find((item) => getItemValue(item) === val);
	}}
	onOpenChange={(o) => {
		if (!o) inputValue = '';
	}}
>
	<FormLabel for={id}>{label}</FormLabel>
	<div class="flex justify-between border border-r-2">
		<Combobox.Input
			{id}
			autocomplete="off"
			class="rounded-9px placeholder:text-foreground-alt/50 inline-flex h-10 w-full truncate border-none bg-background px-3 text-base outline-none transition-colors focus:outline-none sm:text-sm"
			oninput={(e) => (inputValue = e.currentTarget.value)}
			{placeholder}
			aria-label={placeholder}
		/>
		<Combobox.Trigger>
			{#if loading}<CircularProgress class="stroke-primary opacity-50" />{:else}<ChevronsUpDown
					class="opacity-50"
				/>{/if}
		</Combobox.Trigger>
	</div>
	<Combobox.Content
		class="max-h-52 w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] rounded-xl border border-muted bg-background px-2 shadow-popover outline-none"
		sideOffset={10}
	>
		<Combobox.ScrollUpButton class="flex w-full items-center justify-center">
			<ChevronsUp class="size-3" />
		</Combobox.ScrollUpButton>
		<Combobox.Viewport class="p-1">
			{#if loading}<span>Loading...</span>{:else}
				{#each results as result, i (i + getItemValue(result))}
					<Combobox.Item
						class="rounded-button flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 text-sm capitalize outline-none  data-[highlighted]:bg-muted"
						value={getItemValue(result)}
						label={getItemLabel(result)}
					>
						{#snippet children({ selected })}
							{getItemLabel(result)}
							{#if selected}<div class="ml-auto"><Check /></div>{/if}
						{/snippet}
					</Combobox.Item>
				{:else}
					<span class="block px-5 py-2 text-sm text-muted-foreground">
						{emptyMessage}
					</span>
				{/each}
			{/if}
		</Combobox.Viewport>
		<Combobox.ScrollDownButton class="flex w-full items-center justify-center">
			<ChevronsUpDown class="opacity-50" />
		</Combobox.ScrollDownButton>
	</Combobox.Content>
</Combobox.Root>
