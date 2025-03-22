import { test as setup, expect } from '@playwright/test';

import { m } from '$lib/paraglide/messages';
import path from 'path';
import AuthPage from '../pages/auth.page';

setup('authenticate', async ({ page }) => {
	const authPage = new AuthPage(page);
	await authPage.goto();
	await authPage.signIn({
		email: process.env.PLAYWRIGHT_TEST_USER_EMAIL!,
		password: process.env.PLAYWRIGHT_TEST_USER_PASSWORD!
	});
	await expect(page.getByRole('button', { name: m.account_menu() })).toBeVisible();

	await page
		.context()
		.storageState({ path: path.join(import.meta.dirname, '../../../playwright/.auth/user.json') });
});
