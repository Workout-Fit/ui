import { render, fireEvent, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import FormActions from '$lib/components/FormActions.svelte';

describe('<FormActions />', () => {
	it('renders with default labels', () => {
		render(FormActions);
		expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
	});

	it('renders with custom labels', () => {
		render(FormActions, { saveLabel: 'Submit', cancelLabel: 'Abort', oncancel: vi.fn() });
		expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /abort/i })).toBeInTheDocument();
	});

	it('calls oncancel when cancel button is clicked', async () => {
		const oncancel = vi.fn();
		render(FormActions, { oncancel });
		await fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
		expect(oncancel).toHaveBeenCalled();
	});

	it('buttons are disabled when disabled prop is true', () => {
		render(FormActions, { disabled: true, oncancel: vi.fn() });
		expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
		expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
	});
});
