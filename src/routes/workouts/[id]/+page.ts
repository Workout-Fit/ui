export const load = async ({ parent, params: { id }, data, depends }) => {
	const { supabase, user } = await parent();
	const { data: likes } = await supabase
		.from('workouts_likes')
		.select('user_id')
		.eq('workout_id', id);

	console.log('likes', likes);

	depends('supabase:likes');

	return {
		...data,
		likes: likes?.length ?? 0,
		liked: likes?.some((like) => like.user_id === user?.id)
	};
};
