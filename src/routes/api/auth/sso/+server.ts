import type { Database } from '$lib/supabase/database.types.js';

import insertProfile from '$lib/supabase/queries/insertProfile.js';
import type { SignInWithIdTokenCredentials, SupabaseClient, User } from '@supabase/supabase-js';
import { error, json } from '@sveltejs/kit';

const createProfileFromSSO = async (
	provider: SignInWithIdTokenCredentials['provider'],
	user: User,
	supabase: SupabaseClient<Database>
) => {
	let profilePicture: File | undefined;
	if (!user.user_metadata.picture) {
		const { blob } = await fetch(user.user_metadata.picture);
		profilePicture = new File([await blob()], 'avatar.jpg', { type: 'image/jpg' });
	}

	const [profileResponse, avatarResponse] = await insertProfile(
		supabase,
		{
			user_id: user.id,
			username:
				user.user_metadata.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') +
				Math.floor(Math.random() * 1e7),
			full_name: user.user_metadata.full_name
		},
		profilePicture
	);

	if (profileResponse.error || avatarResponse?.error) {
		console.error(profileResponse.error ?? avatarResponse?.error);
		await supabase.auth.signOut();
		return error(
			500,
			`Failed to sign-in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`
		);
	}
};

export const POST = async ({ request, locals: { supabase }, url }) => {
	const data: SignInWithIdTokenCredentials = await request.json();
	const { data: signInData, error: signInError } = await supabase.auth.signInWithIdToken(data);

	if (signInError) {
		console.error(signInError);
		return error(
			500,
			`Failed to sign-in with ${data.provider.charAt(0).toUpperCase() + data.provider.slice(1)}`
		);
	}

	const profile = await supabase
		.from('profiles')
		.select('user_id', { count: 'exact', head: true })
		.eq('user_id', signInData.user.id)
		.limit(1)
		.maybeSingle();

	if (profile.count === 0) await createProfileFromSSO(data.provider, signInData.user, supabase);

	return json({ success: true });
};
