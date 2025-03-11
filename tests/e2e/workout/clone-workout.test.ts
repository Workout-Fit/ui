import { expect } from '@playwright/test';
import WorkoutPage from '../pages/workout.page';
import { m } from '$lib/paraglide/messages';
import { faker } from '@faker-js/faker';
import { test } from '../fixtures';

test.describe('Clone Workout', () => {
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
		await page.getByRole('button', { name: m.clone() }).click();
	});

	test('allows cloning workout', async ({ page }) => {
		await page.getByRole('button', { name: m.clone() }).click();
		await expect(page.getByText(m.based_on())).toBeVisible();
	});
});
