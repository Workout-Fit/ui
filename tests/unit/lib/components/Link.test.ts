import { render, screen, waitFor } from '@testing-library/svelte';
import { createRawSnippet, flushSync } from 'svelte';
import { Link, type LinkProps } from '$lib/components/link';
import { faker } from '@faker-js/faker';
import { goto } from '$app/navigation';

const renderLink = (props?: Partial<LinkProps>) =>
	render(Link, {
		children: createRawSnippet(() => ({ render: faker.word.verb })),
		...props
	} as LinkProps);

describe('Link Component', () => {
	test('renders correctly with href', () => {
		renderLink({ href: '/test' });
		expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
	});

	test.skip('applies active class when href matches current page', async () => {
		renderLink({ href: '/test' });
		goto('/test');
		flushSync();
		await waitFor(() => {
			expect(screen.getByRole('link')).toHaveClass('active');
		});
	});

	test.skip('does not apply active class when href does not match current page', async () => {
		renderLink({ href: '/test' });
		goto('/different');
		flushSync();
		await waitFor(() => {
			expect(screen.getByRole('link')).not.toHaveClass('active');
		});
	});
});
