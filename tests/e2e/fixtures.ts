import type { Database } from '$lib/supabase/database.types';
import { test as base } from '@playwright/test';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

const supabase = createClient<Database>(
	process.env.PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Extend basic test by providing a "todoPage" fixture.
export const test = base.extend<{ supabase: SupabaseClient<Database>; user: User | null }>({
	supabase: async (_, use) => use(supabase),
	user: async ({ context }, use) => {
		const cookies = await context.cookies();
		const encodedToken = cookies
			.find((cookie) => cookie.name === `sb-${process.env.SUPABASE_PROJECT_REF}-auth-token`)
			?.value.replace('base64-', '');

		if (!encodedToken) return;

		const { access_token } = JSON.parse(atob(encodedToken));

		const {
			data: { user }
		} = await supabase.auth.getUser(access_token);
		await use(user);
	}
});
