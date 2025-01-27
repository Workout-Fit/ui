import { type Page } from '@playwright/test';
import * as m from '$lib/paraglide/messages';

export default class AuthPage {
	constructor(readonly page: Page) {}

	async goto() {
		await this.page.goto('/auth');
	}

	async login() {
		await this.page.getByLabel(m.email()).fill(process.env.PLAYWRIGHT_TEST_USER_EMAIL!);
		await this.page.getByLabel(m.password()).fill(process.env.PLAYWRIGHT_TEST_USER_PASSWORD!);
		await this.page.getByRole('button', { name: m.sign_in() }).click();
	}
}
