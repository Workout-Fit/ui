import { expect } from '@playwright/test';
import WorkoutPage from '../pages/workout.page';
import { m } from '$lib/paraglide/messages';
import { faker } from '@faker-js/faker';
import { test } from '../fixtures';

test.describe('Edit Workout', () => {
	let workoutPage: WorkoutPage;
	let workoutId: string;

	test.beforeEach(async ({ page, supabase, user }) => {
		workoutPage = new WorkoutPage(page);
		await workoutPage.gotoCreateWorkout();
		const { data: workout } = await supabase
			.from('workouts')
			.insert({ user_id: user?.id, name: faker.lorem.sentence() })
			.select('id, name')
			.single();

		workoutId = workout!.id;
		await workoutPage.goto(workoutId);
		await page.getByRole('link', { name: m.edit() }).click();
	});

	test('allows editing workout', async ({ page }) => {
		const name = faker.lorem.sentence();
		await page.getByLabel(m.name()).fill(name);
		await page.getByRole('button', { name: m.save() }).click();
		await expect(page.getByText(m.edit_workout_success())).toBeVisible();
	});
});
