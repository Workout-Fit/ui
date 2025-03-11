import { getExercises } from '$lib/supabase/queries/getExercises';
import { baseLocale } from '$lib/paraglide/runtime';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals: { supabase }, url }) => {
	const { data: exercises, error } = await getExercises(
		supabase,
		url.searchParams.get('query') ?? '',
		url.searchParams.get('language') ?? baseLocale
	);

	if (error) console.error(error);

	return json(exercises);
};
