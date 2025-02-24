import { screen, render, fireEvent, waitFor } from '@testing-library/svelte';
import ThemeToggle from '$lib/components/ThemeToggle.svelte';
import * as m from '$lib/paraglide/messages';

vi.mock('localStorage');

describe('<ThemeToggle />', () => {
	beforeEach(() => {
		localStorage.setItem('theme', 'light');
	});

	it('renders with initial theme', () => {
		render(ThemeToggle);
		expect(screen.getByRole('button')).toHaveTextContent(/light/i);
	});

	it('toggles theme on click', async () => {
		render(ThemeToggle);
		const button = screen.getByRole('button');

		fireEvent.click(button);
		await waitFor(() => expect(button).toHaveTextContent(m.dark()));

		fireEvent.click(button);
		await waitFor(() => expect(button).toHaveTextContent(m.light()));
	});

	it('applies theme class to document element', () => {
		render(ThemeToggle);
		expect(document.documentElement.classList.contains('light')).toBe(true);
	});
});
