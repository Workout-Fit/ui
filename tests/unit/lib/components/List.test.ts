import { screen, render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import List, { type ListProps } from '$lib/components/List.svelte';
import { createRawSnippet } from 'svelte';
import { faker } from '@faker-js/faker';

const renderList = <T>(props?: Partial<ListProps<T>>) =>
	render(List, {
		item: createRawSnippet(() => ({ render: faker.word.verb })) as any,
		...props
	});

describe('List component', () => {
	it('renders empty message when items are empty', () => {
		const emptyMessage = faker.lorem.sentence();
		expect(renderList({ emptyMessage }).getByText(emptyMessage)).toBeInTheDocument();
	});

	it('renders items if available', () => {
		const items = ['Item 1', 'Item 2'];
		renderList({
			items,
			item: createRawSnippet<[item: string]>((item) => ({
				render: () => `<div>${item()}</div>`
			})) as any
		});

		items.forEach((item) => {
			expect(screen.getByText(item)).toBeVisible();
		});
	});
});
