import { i18n } from '$lib/i18n';
import { getExercises } from '$lib/supabase/queries/getExercises';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals: { supabase }, url }) => {
	const { data: exercises, error } = await getExercises(
		supabase,
		url.searchParams.get('query') ?? '',
		url.searchParams.get('language') ?? i18n.config.defaultLanguageTag
	);

	if (error) console.error(error);

	return json(exercises);
};
