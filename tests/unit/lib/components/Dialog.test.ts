import Dialog from '$lib/components/Dialog.svelte';
import { screen, render, fireEvent, waitFor } from '@testing-library/svelte';

describe('<Dialog />', () => {
	it.each([
		['opens', true],
		['closes', false]
	])('%s if `open` === %s', async (_s, open) => {
		render(Dialog, { open });

		if (open) expect(screen.getByRole('dialog')).toBeInTheDocument();
		else expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('closes when clicking outside', async () => {
		render(Dialog, { open: true });

		expect(screen.getByRole('dialog')).toBeInTheDocument();
		// Click outside the dialog
		fireEvent.mouseDown(screen.getByRole('dialog'));

		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});

	it('calls `onclose` when clicking the close button', async () => {
		const onClose = vi.fn();
		render(Dialog, { open: true, onclose: onClose });

		expect(screen.getByRole('dialog')).toBeInTheDocument();
		// Click the close button
		fireEvent.click(screen.getByRole('button', { name: /close/i }));

		await waitFor(() => {
			expect(onClose).toHaveBeenCalled();
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});
});
