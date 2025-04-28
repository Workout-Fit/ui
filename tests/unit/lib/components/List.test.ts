import { screen, render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { List, type ListProps } from '$lib/components/list';
import { createRawSnippet } from 'svelte';
import { faker } from '@faker-js/faker';

const renderList = <T extends { id: any; [key: string]: any }>(props?: Partial<ListProps<T>>) =>
	render(List, {
		item: createRawSnippet(() => ({ render: faker.word.verb })) as any,
		...props
	} as any);

describe('List component', () => {
	it('renders empty message when items are empty', () => {
		const emptyMessage = faker.lorem.sentence();
		expect(renderList({ emptyMessage }).getByText(emptyMessage)).toBeInTheDocument();
	});

	it('renders items if available', () => {
		const items = [
			{ id: 1, label: 'Item 1' },
			{ id: 2, label: 'Item 2' }
		];
		renderList({
			items,
			item: createRawSnippet<[item: { id: string; label: string }]>((item) => ({
				render: () => `<div>${item().label}</div>`
			})) as any
		});

		items.forEach((item) => {
			expect(screen.getByText(item.label)).toBeVisible();
		});
	});
});
