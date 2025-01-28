import { type Page } from '@playwright/test';
import * as m from '$lib/paraglide/messages';
import type { profileFormSchema } from '$lib/forms/ProfileForm.svelte';
import type { z } from 'zod';

export default class ProfilePage {
	constructor(readonly page: Page) {}

	async goto(username: string) {
		await this.page.goto(`/profile/${username}`);
	}

	async gotoEditProfile(username: string) {
		await this.page.goto(`/profile/${username}/edit`);
	}

	async fillProfileDetails({
		full_name,
		username,
		weight,
		height,
		bio
	}: Omit<z.infer<typeof profileFormSchema>, 'avatarUrl' | 'avatar'>) {
		await this.page.getByLabel(m.name(), { exact: true }).fill(full_name);
		await this.page.getByLabel(m.username()).fill(username);
		if (weight) await this.page.getByLabel(m.weight()).fill(weight.toString());
		if (height) await this.page.getByLabel(m.height()).fill(height.toString());
		if (bio) await this.page.getByLabel(m.bio()).fill(bio);
	}

	async uploadAvatar(avatar: { name: string; mimeType: string; buffer: Buffer }) {
		const fileChooserPromise = this.page.waitForEvent('filechooser');
		await this.page.getByLabel(m.avatar()).click();
		const fileChooser = await fileChooserPromise;
		await fileChooser.setFiles(avatar);
	}

	async submitForm() {
		await this.page.getByRole('button', { name: m.save() }).click();
	}
}
