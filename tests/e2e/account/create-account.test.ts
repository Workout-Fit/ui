import { expect } from '@playwright/test';
import { test } from '../fixtures';
import type { User } from '@supabase/supabase-js';
import AuthPage from '../pages/auth.page';
import * as m from '$lib/paraglide/messages';
import { createUser } from '../factories';
import type { signUpFormSchema } from '$routes/auth/+page.svelte';
import type { z } from 'zod';

test.describe('Create Account', () => {
	let authPage: AuthPage;
	let user: z.infer<typeof signUpFormSchema>;

	test.beforeEach(async ({ page }) => {
		authPage = new AuthPage(page);
		await authPage.goto();
	});

	test('validates user form', async ({ page }) => {
		await page.getByRole('button', { name: m.sign_up() }).click();
		await page.getByRole('button', { name: m.sign_up() }).click();
		await expect(page.getByText('String must contain at least 1 character(s)')).toHaveCount(3);
		await expect(page.getByText('String must contain at least 8 character(s)')).toHaveCount(1);
	});

	test('creates a new account', async ({ page }) => {
		user = createUser();

		await authPage.signUp(user);
		await expect(page.getByRole('button', { name: m.sign_out() })).toBeVisible();
		page.getByRole('link', { name: m.profile() }).click();
		await expect(page.getByText(user.full_name)).toBeVisible();
		await expect(page.getByText(user.username)).toBeVisible();
		if (user.weight) await expect(page.getByText(user.weight.toString())).toBeVisible();
		if (user.height) await expect(page.getByText((user.height / 100).toString())).toBeVisible();
		if (user.bio) await expect(page.getByText(user.bio)).toBeVisible();
	});

	test.afterEach(async ({ supabase }) => {
		if (!user) return;

		const { data } = await supabase
			.from('profiles')
			.delete()
			.eq('username', user.username)
			.select('user_id')
			.single();

		if (!data) return;

		await supabase.auth.admin.deleteUser(data.user_id);
	});
});
