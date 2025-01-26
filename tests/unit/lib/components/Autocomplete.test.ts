import Autocomplete from '$lib/components/Autocomplete.svelte';
import { faker } from '@faker-js/faker';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { createRawSnippet, type Snippet } from 'svelte';

const itemSnippet = createRawSnippet((item: () => string) => ({
	render: () => item()
})) as Snippet<[item: unknown]>;

describe('<Autocomplete />', () => {
	it('renders an input', () => {
		const loadFunction = vi
			.fn()
			.mockResolvedValue(faker.helpers.uniqueArray(() => faker.word.noun(), 10));
		render(Autocomplete, {
			loadFunction,
			debounceValue: 1,
			renderItem: itemSnippet,
			renderValue: itemSnippet
		});

		expect(screen.getByRole('textbox')).toBeInTheDocument();
	});

	it('calls loadFunction with the search term', async () => {
		const loadFunction = vi
			.fn()
			.mockResolvedValue(faker.helpers.uniqueArray(() => faker.word.noun(), 10));
		const query = faker.word.noun();
		render(Autocomplete, {
			loadFunction,
			debounceValue: 1,
			renderItem: itemSnippet,
			renderValue: itemSnippet
		});

		fireEvent.input(screen.getByRole('textbox'), { target: { value: query } });

		await waitFor(() => {
			expect(loadFunction).toHaveBeenCalledWith(query);
		});
	});

	it('renders results', async () => {
		const loadFunction = vi
			.fn()
			.mockResolvedValue(faker.helpers.uniqueArray(() => faker.word.noun(), 10));
		const query = faker.word.noun();
		render(Autocomplete, {
			loadFunction,
			debounceValue: 1,
			renderItem: itemSnippet,
			renderValue: itemSnippet
		});

		fireEvent.input(screen.getByRole('textbox'), { target: { value: query } });

		await waitFor(() => {
			expect(screen.getAllByRole('option')).toHaveLength(10);
		});
	});

	describe('with selected result', () => {
		it('renders a close button', async () => {
			const results = faker.helpers.uniqueArray(() => faker.word.noun(), 10);
			const selectedResult = faker.helpers.arrayElement(results);

			const loadFunction = vi.fn().mockResolvedValue(results);
			const query = faker.word.noun();
			render(Autocomplete, {
				loadFunction,
				debounceValue: 1,
				renderItem: itemSnippet,
				renderValue: itemSnippet
			});

			fireEvent.input(screen.getByRole('textbox'), { target: { value: query } });

			await waitFor(() => {
				fireEvent.mouseDown(screen.getByRole('option', { name: selectedResult }));
			});

			expect(await screen.findByRole('button')).toBeInTheDocument();
		});

		it('clears when the close button is clicked', async () => {
			const results = faker.helpers.uniqueArray(() => faker.word.noun(), 10);
			const selectedResult = faker.helpers.arrayElement(results);

			const loadFunction = vi.fn().mockResolvedValue(results);
			const query = faker.word.noun();
			render(Autocomplete, {
				loadFunction,
				debounceValue: 1,
				renderItem: itemSnippet,
				renderValue: itemSnippet
			});

			fireEvent.input(screen.getByRole('textbox'), { target: { value: query } });

			await waitFor(() => {
				fireEvent.mouseDown(screen.getByText(selectedResult));
			});

			fireEvent.click(screen.getByRole('button', { name: 'clear' }));

			await waitFor(() => {
				expect(screen.queryAllByText(selectedResult)).toHaveLength(0);
			});
		});
	});
});
