import { faker } from '@faker-js/faker';
import { expect } from '@playwright/test';
import { test } from '../fixtures';
import ProfilePage from '../pages/profile.page';
import type { User } from '@supabase/supabase-js';
import AuthPage from '../pages/auth.page';
import { m } from '$lib/paraglide/messages';

test.describe('Edit Profile', () => {
	let profilePage: ProfilePage;
	let user: User;
	let username: string;

	test.beforeEach(async ({ page, supabase }) => {
		profilePage = new ProfilePage(page);
		const authPage = new AuthPage(page);

		const email = faker.internet.email();
		const password = faker.internet.password();

		const { data } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
		user = data.user!;

		const { data: profileData } = await supabase
			.from('profiles')
			.insert({
				user_id: user.id,
				full_name: faker.person.fullName(),
				username: faker.internet.username(),
				weight: faker.number.float({ min: 50, max: 150, fractionDigits: 1 }),
				height: faker.number.int({ min: 150, max: 200 }),
				bio: faker.lorem.paragraph()
			})
			.select('username')
			.single();

		username = profileData!.username;

		await authPage.goto();
		await authPage.signIn({ email, password });
		await expect(page.getByRole('button', { name: m.sign_out() })).toBeVisible();

		await profilePage.goto(username);
	});

	test('saves profile details', async ({ page }) => {
		const profile = {
			full_name: faker.person.fullName(),
			username: faker.internet.username(),
			weight: faker.number.float({ min: 50, max: 150, fractionDigits: 1 }),
			height: faker.number.int({ min: 150, max: 200 }),
			bio: faker.hacker.phrase()
		};
		await profilePage.gotoEditProfile(username);

		await profilePage.fillProfileDetails(profile);

		await profilePage.submitForm();

		await expect(page.getByText(m.profile_edit_success())).toBeVisible();
		await expect(page.getByText(profile.full_name)).toBeVisible();
		await expect(page.getByText(profile.username)).toBeVisible();
		await expect(page.getByText(profile.weight.toString())).toBeVisible();
		await expect(page.getByText((profile.height / 100).toString())).toBeVisible();
		await expect(page.getByText(profile.bio)).toBeVisible();
	});

	test.afterEach(async ({ supabase }) => {
		await Promise.all([
			supabase.auth.admin.deleteUser(user.id),
			supabase.from('profiles').delete().eq('user_id', user.id)
		]);
	});
});
