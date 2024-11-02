import { fireEvent, render, screen } from '@testing-library/svelte';
import { faker } from '@faker-js/faker';
import ListItem from '$lib/components/ListItem.svelte';
import { createRawSnippet } from 'svelte';

describe('<ListItem />', () => {
	it('renders a div if neither `href` or `onclick` is provided', () => {
		const textContent = faker.lorem.sentence();
		render(ListItem, { title: textContent });

		expect(screen.queryByRole('link')).not.toBeInTheDocument();
		expect(screen.queryByRole('button')).not.toBeInTheDocument();

		expect(screen.getByText(textContent)).toBeInTheDocument();
	});
	it('renders a link if `href` is provided', () => {
		const textContent = faker.lorem.sentence();
		render(ListItem, {
			title: textContent,
			href: faker.internet.url()
		});

		expect(screen.getByRole('link')).toBeInTheDocument();
	});

	describe('when `onclick` is provided', () => {
		it('renders a button', () => {
			const textContent = faker.lorem.sentence();
			render(ListItem, {
				title: textContent,
				onclick: vi.fn()
			});

			expect(screen.getByRole('button')).toBeInTheDocument();
		});

		it('calls onclick', () => {
			const textContent = faker.lorem.sentence();
			const onclick = vi.fn();
			render(ListItem, {
				title: textContent,
				onclick
			});

			fireEvent.click(screen.getByRole('button'));

			expect(onclick).toHaveBeenCalledOnce();
		});
	});

	it.each(['leftDecoration', 'rightDecoration'])('renders %s if provided', (decoration) => {
		const decorationContent = faker.lorem.sentence();
		render(ListItem, {
			title: faker.lorem.sentence(),
			[decoration]: createRawSnippet(() => ({ render: () => `<p>${decorationContent}</p>` }))
		});

		expect(screen.getByText(decorationContent)).toBeInTheDocument();
	});
});
