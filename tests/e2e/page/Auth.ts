import { type Page } from '@playwright/test';
import * as m from '$lib/paraglide/messages';

export class AuthPage {
	constructor(readonly page: Page) {}

	async login() {
		await this.page.getByRole('button', { name: m.login() }).click();
	}
}
