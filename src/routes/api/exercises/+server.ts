import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals: { supabase }, url }) => {
	const { data: exercises, error } = await supabase
		.from('exercises')
		.select()
		.ilike('name', `%${url.searchParams.get('query')?.trim().toLowerCase()}%`)
		.limit(10);

	if (error) console.error(error);

	return json(exercises);
};
