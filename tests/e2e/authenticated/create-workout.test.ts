import { expect } from '@playwright/test';
import WorkoutPage from '../pages/workout.page';
import { faker } from '@faker-js/faker';
import * as m from '$lib/paraglide/messages';

import { test } from '../fixtures';

test.describe('Create Workout', () => {
	let workoutPage: WorkoutPage;
	const workoutName = faker.word.words(2);
	const workoutNotes = faker.lorem.sentence();

	test.beforeEach(async ({ page }) => {
		workoutPage = new WorkoutPage(page);
		await workoutPage.gotoCreateWorkout();
	});

	test('shows validation errors when submitting empty form', async ({ page }) => {
		await workoutPage.submitForm();
		await expect(page.getByText('String must contain at least 1 character(s)')).toBeVisible();
	});

	test('shows validation errors when submitting form with invalid exercise', async ({ page }) => {
		await page.getByRole('button', { name: m.add_exercise() }).click();
		await page.getByRole('dialog').getByRole('button', { name: m.save() }).click();
		await expect(page.getByText('Expected object, received null')).toBeVisible();
		await expect(page.getByText('Expected number, received null')).toHaveCount(3);
	});

	test('allows removing exercises', async ({ page }) => {
		const exercise = {
			exercise: { id: '1', name: 'Barbell Front Raise' },
			sets: faker.number.int({ min: 2, max: 4 }),
			repetitions: faker.number.int({ min: 8, max: 15 }),
			rest: faker.number.int({ min: 60, max: 120 }),
			notes: faker.lorem.sentence()
		};

		await workoutPage.addExercise(exercise);
		await expect(page.getByText(exercise.exercise.name)).toBeVisible();
		await page.getByRole('button', { name: m.remove() }).click();
		await expect(page.getByText(exercise.exercise.name)).not.toBeVisible();
	});

	test('creates workout successfully', async ({ page }) => {
		const exercise = ['Barbell Front Raise', 'Barbell Full Squat'].map((name) => ({
			exercise: { id: '1', name },
			sets: faker.number.int({ min: 2, max: 4 }),
			repetitions: faker.number.int({ min: 8, max: 15 }),
			rest: faker.number.int({ min: 60, max: 120 }),
			notes: faker.lorem.sentence()
		}));

		await workoutPage.fillWorkoutDetails({ name: workoutName, notes: workoutNotes });

		await workoutPage.addExercise(exercise[0]);
		await workoutPage.addExercise(exercise[1]);
		await workoutPage.submitForm();

		// Verify workout was created
		await expect(page.getByText(m.created_on())).toBeVisible();
		await expect(page.getByRole('heading', { name: workoutName })).toBeVisible();
		await expect(page.getByText(workoutNotes)).toBeVisible();
	});
});
