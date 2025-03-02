import { type Page, expect } from '@playwright/test';
import * as m from '$lib/paraglide/messages';
import type { WorkoutExercise } from '$lib/types';

export default class WorkoutPage {
	constructor(readonly page: Page) {}

	async goto(workoutId: string) {
		await this.page.goto(`/workouts/${workoutId}`);
	}

	async gotoCreateWorkout() {
		await this.page.goto('/new');
	}

	async fillWorkoutDetails({ name, notes }: { name: string; notes?: string }) {
		await this.page.getByLabel(m.name()).fill(name);
		if (notes) await this.page.getByRole('textbox', { name: m.notes() }).fill(notes);
	}

	async addExercise({ exercise, sets, repetitions, rests, notes }: WorkoutExercise) {
		await this.page.getByRole('button', { name: m.add_exercise() }).click();
		const exerciseDialog = await this.page.getByRole('dialog');

		await exerciseDialog.getByLabel(m.exercise()).fill(exercise.name);
		await exerciseDialog.getByRole('button', { name: 'expand' }).click();
		await exerciseDialog.getByRole('option', { name: exercise.name, exact: true }).click();
		await exerciseDialog.getByLabel(m.sets()).fill(sets[0].toString());
		await exerciseDialog.getByLabel(m.repetitions()).fill(repetitions[0].toString());
		if (rests?.[0]) await exerciseDialog.getByLabel(m.rest()).fill(rests[0].toString());
		if (notes) await exerciseDialog.getByLabel(m.notes()).fill(notes);

		await exerciseDialog.getByRole('button', { name: m.save() }).click();
		await expect(exerciseDialog).not.toBeVisible();
	}

	async editExercise(
		index: number,
		{ exercise, sets, repetitions, rests, notes }: WorkoutExercise
	) {
		await this.page.getByRole('button', { name: m.edit() }).nth(index).click();
		const exerciseDialog = await this.page.getByRole('dialog');

		await exerciseDialog.getByLabel(m.exercise()).clear();
		await exerciseDialog.getByLabel(m.exercise()).fill(exercise.name);
		await exerciseDialog.getByRole('option', { name: exercise.name, exact: true }).click();
		await exerciseDialog.getByLabel(m.sets()).fill(sets[0].toString());
		await exerciseDialog.getByLabel(m.repetitions()).fill(repetitions[0].toString());
		if (rests?.[0]) await exerciseDialog.getByLabel(m.rest()).fill(rests[0].toString());
		if (notes) await exerciseDialog.getByLabel(m.notes()).fill(notes);

		await exerciseDialog.getByRole('button', { name: m.save() }).click();
		await expect(exerciseDialog).not.toBeVisible();
	}

	async deleteWorkout() {
		await this.page.getByRole('button', { name: m.delete_action() }).click();
		await this.page
			.getByRole('alertdialog')
			.getByRole('button', { name: m.delete_action() })
			.click();
	}

	async cloneWorkout() {
		await this.page.getByRole('button', { name: m.clone() }).click();
	}

	async submitForm() {
		await this.page.getByRole('button', { name: m.save() }).click();
	}
}
