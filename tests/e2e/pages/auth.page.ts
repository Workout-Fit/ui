import { type Page } from '@playwright/test';
import { m } from '$lib/paraglide/messages';
import type { z } from 'zod';
import type { signUpFormSchema } from '$routes/auth/+page.svelte';
import ProfilePage from './profile.page';
import type { authFormSchema } from '$lib/forms/AuthForm.svelte';

export default class AuthPage extends ProfilePage {
	constructor(readonly page: Page) {
		super(page);
	}

	async goto() {
		await this.page.goto('/auth');
	}

	async fillAccountDetails(form: z.infer<typeof authFormSchema>) {
		await this.page.getByLabel(m.email()).fill(form.email);
		await this.page.getByLabel(m.password()).fill(form.password);
	}

	async signUp(form: z.infer<typeof signUpFormSchema>) {
		await this.page.getByRole('button', { name: m.sign_up() }).click();
		await this.fillAccountDetails(form);
		await this.fillProfileDetails(form);
		await this.page.getByRole('button', { name: m.sign_up() }).click();
	}

	async signIn(form: z.infer<typeof authFormSchema>) {
		await this.fillAccountDetails(form);
		await this.page.getByRole('button', { name: m.sign_in() }).click();
	}
}
