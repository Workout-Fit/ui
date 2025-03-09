<script lang="ts" generics="Item">
	import Check from '@material-symbols/svg-400/sharp/check.svg?component';
	import ChevronsUpDown from '@material-symbols/svg-400/sharp/expand_all.svg?component';
	import ChevronsUp from '@material-symbols/svg-400/sharp/keyboard_arrow_up.svg?component';
	import { Combobox } from 'bits-ui';
	import debounce from 'lodash/debounce';
	import { CircularProgress } from '$lib/components/circular-progress';
	import { FormLabel } from '$lib/components/form';

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

	let query = $state(value ? getItemLabel(value) : '');
	let loading = $state(false);
	let open = $state(false);
	let results = $state<Item[]>([]);

	const updateQuery = debounce((value: string) => (query = value), debounceValue);

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
	value={value ? getItemValue(value) : ''}
	onValueChange={(val: string) => {
		value = results.find((item) => getItemValue(item) === val);
	}}
>
	<FormLabel for={id}>{label}</FormLabel>
	<div class="relative">
		<Combobox.Input
			{id}
			{placeholder}
			autocomplete="off"
			class="inline-flex h-9 w-full items-center justify-between rounded-md border border-input
      bg-transparent px-3 py-1 shadow-sm outline-none transition-colors
      placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none
      focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
			defaultValue={query}
			oninput={(e) => updateQuery(e.currentTarget?.value)}
			aria-label={placeholder}
		/>
		{#if loading}
			<CircularProgress class="absolute end-1 size-6 h-9 stroke-primary opacity-50" />
		{:else}
			<Combobox.Trigger aria-label="expand" disabled={loading} class="absolute end-1 size-6 h-9">
				<ChevronsUpDown width={16} height={16} class="fill-foreground opacity-50" />
			</Combobox.Trigger>
		{/if}
	</div>
	<Combobox.Content
		class="max-h-52 w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] rounded-xl border border-muted bg-background px-2 shadow-popover outline-none"
	>
		<Combobox.ScrollUpButton class="flex w-full items-center justify-center">
			<ChevronsUp width={16} class="size-3" />
		</Combobox.ScrollUpButton>
		<Combobox.Viewport class="p-1">
			{#if loading}
				<small class="text-sm">Loading...</small>
			{:else}
				{#each results as result, i (i + getItemValue(result))}
					<Combobox.Item
						class="rounded-button flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 text-sm capitalize outline-none  data-[highlighted]:bg-muted"
						value={getItemValue(result)}
						label={getItemLabel(result)}
					>
						{#snippet children({ selected })}
							{getItemLabel(result)}
							{#if selected}<div class="ml-auto"><Check width={16} /></div>{/if}
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
			<ChevronsUpDown width={16} class="opacity-50" />
		</Combobox.ScrollDownButton>
	</Combobox.Content>
</Combobox.Root>
