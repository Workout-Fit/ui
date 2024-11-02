import Autocomplete from '$lib/components/Autocomplete.svelte';
import { faker } from '@faker-js/faker';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';

describe('<Autocomplete />', () => {
	it('renders an input', () => {
		const loadFunction = vi
			.fn()
			.mockResolvedValue(faker.helpers.multiple(() => faker.word.noun(), { count: 10 }));
		render(Autocomplete, { loadFunction, debounceValue: 1 });

		expect(screen.getByRole('combobox')).toBeInTheDocument();
	});

	it('calls loadFunction with the search term', async () => {
		const loadFunction = vi
			.fn()
			.mockResolvedValue(faker.helpers.multiple(() => faker.word.noun(), { count: 10 }));
		const query = faker.word.noun();
		render(Autocomplete, { loadFunction, debounceValue: 1 });

		fireEvent.input(screen.getByRole('combobox'), { target: { value: query } });

		await waitFor(() => {
			expect(loadFunction).toHaveBeenCalledWith(query);
		});
	});

	it('renders results', async () => {
		const loadFunction = vi
			.fn()
			.mockResolvedValue(faker.helpers.multiple(() => faker.word.noun(), { count: 10 }));
		const query = faker.word.noun();
		render(Autocomplete, { loadFunction, debounceValue: 1 });

		fireEvent.input(screen.getByRole('combobox'), { target: { value: query } });

		await waitFor(() => {
			expect(screen.getAllByRole('option')).toHaveLength(10);
		});
	});

	describe('with selected result', () => {
		it('renders a close button', async () => {
			const results = faker.helpers.multiple(() => faker.word.noun(), { count: 10 });
			const selectedResult = faker.helpers.arrayElement(results);

			const loadFunction = vi.fn().mockResolvedValue(results);
			const query = faker.word.noun();
			render(Autocomplete, { loadFunction, debounceValue: 1 });

			fireEvent.input(screen.getByRole('combobox'), { target: { value: query } });

			await waitFor(() => {
				fireEvent.click(screen.getByText(selectedResult));
			});

			expect(screen.getByRole('button')).toBeInTheDocument();
		});

		it.skip('clears when the close button is clicked', async () => {
			const results = faker.helpers.multiple(() => faker.word.noun(), { count: 10 });
			const selectedResult = faker.helpers.arrayElement(results);

			const loadFunction = vi.fn().mockResolvedValue(results);
			const query = faker.word.noun();
			render(Autocomplete, { loadFunction, debounceValue: 1 });

			fireEvent.input(screen.getByRole('combobox'), { target: { value: query } });

			await waitFor(() => {
				fireEvent.click(screen.getByText(selectedResult));
			});

			fireEvent.click(screen.getByRole('button'));

			await waitFor(() => {
				expect(screen.queryAllByText(selectedResult)?.[0]).not.toBeInTheDocument();
			});
		});
	});
});
