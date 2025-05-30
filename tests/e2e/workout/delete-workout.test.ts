import { expect } from '@playwright/test';
import WorkoutPage from '../pages/workout.page';
import { m } from '$lib/paraglide/messages';
import { faker } from '@faker-js/faker';
import { test } from '../fixtures';

test.describe('Delete Workout', () => {
	let workoutPage: WorkoutPage;
	let workoutId: string;
	let workoutName: string;

	test.beforeEach(async ({ page, supabase, user }) => {
		workoutPage = new WorkoutPage(page);
		await workoutPage.gotoCreateWorkout();
		const { data: workout } = await supabase
			.from('workouts')
			.insert({ user_id: user?.id, name: faker.lorem.sentence() })
			.select('id, name')
			.single();

		workoutId = workout!.id;
		workoutName = workout!.name;
		await workoutPage.goto(workoutId);
		await page.waitForLoadState('networkidle');
	});

	test('prevents deletion of workout without confirmation', async ({ page }) => {
		await page.getByRole('button', { name: m.delete_action() }).click();
		await expect(
			page
				.getByRole('alertdialog')
				.getByText(m.delete_workout_confirmation_title({ workout: workoutName }))
		).toBeVisible();
		await page.getByRole('alertdialog').getByRole('button', { name: m.cancel() }).click();
		await expect(page.getByRole('alertdialog')).not.toBeVisible();
		await expect(page.getByText(workoutName, { exact: true })).toBeVisible();
	});

	test('deletes workout after confirmation', async ({ page }) => {
		await workoutPage.deleteWorkout();
		await expect(page.getByText(m.workout_delete_success())).toBeVisible();
	});
});
