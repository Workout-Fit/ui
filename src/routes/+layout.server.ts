import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async ({ locals: { safeGetSession }, cookies }) => ({
	session: await safeGetSession(),
	cookies: cookies.getAll()
}));
