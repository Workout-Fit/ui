import { error, text } from '@sveltejs/kit';

export const DELETE = async ({ params, locals: { supabase } }) => {
	const { error: deleteWorkoutError } = await supabase
		.from('workouts')
		.delete()
		.eq('id', params.id);

	if (deleteWorkoutError) {
		console.error(deleteWorkoutError);
		return error(500, 'Error when deleting Workout');
	}

	return text('Successfully deleted Workout');
};
