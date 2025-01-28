import { type Page } from '@playwright/test';
import * as m from '$lib/paraglide/messages';

export default class AuthPage {
	constructor(readonly page: Page) {}

	async goto() {
		await this.page.goto('/auth');
	}

	async signIn({ email, password }: { email: string; password: string }) {
		await this.page.getByLabel(m.email()).fill(email);
		await this.page.getByLabel(m.password()).fill(password);
		await this.page.getByRole('button', { name: m.sign_in() }).click();
	}
}
