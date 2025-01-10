import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Button, { type ButtonProps } from '$lib/components/Button.svelte';
import { createRawSnippet } from 'svelte';
import { faker } from '@faker-js/faker';

const renderButton = (props?: Partial<ButtonProps>) =>
	render(Button, { children: createRawSnippet(() => ({ render: faker.word.verb })), ...props });

describe('<Button />', () => {
	it('renders a custom label', () => {
		const label = faker.word.verb();
		renderButton({ children: createRawSnippet(() => ({ render: () => label })) });

		expect(screen.getByRole('button')).toHaveTextContent(label);
	});

	it.each(['primary', 'text'] as ButtonProps['variant'][])(`renders a %s button`, (variant) => {
		renderButton({ variant });
		expect(screen.getByRole('button')).toHaveClass(`button--${variant}`);
	});

	describe('loading', () => {
		it('shows CircularProgress when loading', () => {
			expect(renderButton({ loading: true }).getByRole('progressbar')).toBeInTheDocument();
		});

		it('disables the button when loading', () => {
			expect(renderButton({ loading: true }).getByRole('button')).toBeDisabled();
		});
	});
});
