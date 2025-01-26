import { test as setup, expect } from '@playwright/test';

import * as m from '$lib/paraglide/messages';
import path from 'path';
import { AuthPage } from './page/Auth';

setup('authenticate', async ({ page }) => {
	const authPage = new AuthPage(page);
	await authPage.goto();
	await authPage.login();
	await expect(page.getByRole('button', { name: m.sign_out() })).toBeVisible();

	await page
		.context()
		.storageState({ path: path.join(__dirname, '../../playwright/.auth/user.json') });
});
