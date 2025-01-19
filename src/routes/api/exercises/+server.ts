import { languageTag } from '$lib/paraglide/runtime';
import { getExercises } from '$lib/supabase/queries/getExercises';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals: { supabase }, url }) => {
	const { data: exercises, error } = await getExercises(
		supabase,
		url.searchParams.get('query') ?? '',
		languageTag()
	);

	if (error) console.error(error);

	return json(exercises);
};
