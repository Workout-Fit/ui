import { error } from '@sveltejs/kit';

export const DELETE = async ({ params, locals: { supabase } }) => {
	const { error: deleteWorkoutError } = await supabase
		.from('workouts')
		.delete()
		.eq('id', params.id);

	if (deleteWorkoutError) {
		console.error(deleteWorkoutError);
		return error(500);
	}

	return new Response();
};
