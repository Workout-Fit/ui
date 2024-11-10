import { getExercises } from '$lib/supabase/queries/exercise';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals: { supabase }, url }) => {
	const { data: exercises, error } = await getExercises(supabase)
		.ilike('name', `%${url.searchParams.get('query')?.trim().toLowerCase()}%`)
		.limit(10);

	if (error) console.error(error);

	return new Response(JSON.stringify(exercises));
};
