import { test as teardown } from '../fixtures';

teardown('delete workouts', async ({ supabase, user }) => {
	if (user) await supabase.from('workouts').delete().eq('user_id', user.id);
});
