<script lang="ts" module>
	import { type Snippet } from 'svelte';

	export type ListProps<T> = {
		items?: T[];
		emptyMessage?: string;
		item: Snippet<[item: T, index: number]>;
		sortable?: boolean;
		onReorder?: (items: T[]) => void;
	};
</script>

<script lang="ts" generics="T extends { id?: string | number, [key: string]: any }">
	import DragIndicator from '@material-symbols/svg-400/sharp/drag_indicator.svg?component';
	import { flip } from 'svelte/animate';
	import { dragHandleZone, type Item, dragHandle } from 'svelte-dnd-action';
	import { cn } from '$lib/utils';

	let {
		items: initialItems = [],
		emptyMessage = 'No items available',
		item: itemSnippet,
		sortable,
		onReorder
	}: ListProps<T> = $props();

	let items = $state([...initialItems]);

	$effect(() => {
		items = initialItems;
	});
</script>

{#if items.length === 0}
	<i class="mx-auto my-2 block text-center text-sm opacity-70">{emptyMessage}</i>
{:else}
	<ul
		class="flex list-none flex-col gap-2"
		use:dragHandleZone={{
			items: items as Item[],
			flipDurationMs: 300,
			dragDisabled: !sortable,
			autoAriaDisabled: true,
			dropTargetStyle: { outline: 'none' },
			dropTargetClasses: ['bg-slate-300/10', 'w-full']
		}}
		onconsider={(e) => {
			items = e.detail.items as T[];
		}}
		onfinalize={(e) => {
			items = e.detail.items as T[];
			onReorder?.(items);
		}}
	>
		{#each items as item, index (item.id)}
			<li
				animate:flip={{ duration: 300 }}
				class={cn({ 'grid grid-cols-[auto,1fr] items-center': sortable })}
			>
				{#if sortable}
					<span use:dragHandle>
						<DragIndicator
							class="handle size-8 fill-stone-400 hover:cursor-grab hover:active:cursor-grabbing"
						/>
					</span>
				{/if}
				{@render itemSnippet(item, index)}
			</li>
		{/each}
	</ul>
{/if}
