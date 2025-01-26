import { screen, render, fireEvent } from '@testing-library/svelte';
import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
import type { ComponentProps } from 'svelte';
import { faker } from '@faker-js/faker';

const renderConfirmationDialog = (props?: Partial<ComponentProps<typeof ConfirmationDialog>>) =>
	render(ConfirmationDialog, {
		open: true,
		title: faker.lorem.sentence(),
		message: faker.lorem.paragraph(),
		confirmLabel: 'Confirm',
		onconfirm: vi.fn(),
		oncancel: vi.fn(),
		...props
	});

describe('ConfirmationDialog', () => {
	it('renders with correct title and message', () => {
		const title = faker.lorem.sentence();
		const message = faker.lorem.paragraph();

		renderConfirmationDialog({ title, message });

		expect(screen.getByText(title)).toBeInTheDocument();
		expect(screen.getByText(message)).toBeInTheDocument();
	});

	it('calls onconfirm when confirm button is clicked', () => {
		const onconfirm = vi.fn();
		renderConfirmationDialog({ onconfirm });

		fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

		expect(onconfirm).toHaveBeenCalled();
	});

	it('calls oncancel when cancel button is clicked', () => {
		const oncancel = vi.fn();
		renderConfirmationDialog({ oncancel });

		fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

		expect(oncancel).toHaveBeenCalled();
	});

	it('disables buttons when disabled prop is true', () => {
		renderConfirmationDialog({ disabled: true });

		expect(screen.getByRole('button', { name: /confirm/i })).toBeDisabled();
		expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
	});
});
