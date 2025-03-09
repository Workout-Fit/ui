import { render, screen } from '@testing-library/svelte';
import { faker } from '@faker-js/faker';
import { ListItem } from '$lib/components/list';
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

	it.each(['leftDecoration', 'rightDecoration'])('renders %s if provided', (decoration) => {
		const decorationContent = faker.lorem.sentence();
		render(ListItem, {
			title: faker.lorem.sentence(),
			[decoration]: createRawSnippet(() => ({ render: () => decorationContent }))
		});

		expect(screen.getByText(decorationContent)).toBeInTheDocument();
	});
});
