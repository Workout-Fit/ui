import { i18n } from '$lib/i18n.js';
import { error } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import * as m from '$lib/paraglide/messages';

export const DELETE = async ({ params, locals: { supabase }, cookies }) => {
	const { error: deleteWorkoutError } = await supabase
		.from('workouts')
		.delete()
		.eq('id', params.id);

	if (deleteWorkoutError) {
		console.error(deleteWorkoutError);
		return error(500, 'Failed to delete workout');
	}

	return redirect(
		i18n.resolveRoute('/'),
		{ text: m.workout_delete_success(), type: 'success' },
		cookies
	);
};
