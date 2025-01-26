import type { Database } from '$lib/supabase/database.types';
import type { WorkoutExercise } from '$lib/types';
import { parseWorkoutExercises } from '$lib/utils/parser';
import { faker } from '@faker-js/faker';

describe('parseWorkoutExercises', () => {
	it('should parse workout exercises', () => {
		const workout = {
			exercises: faker.helpers.multiple(() => ({
				exercise: { i18n: [{ name: faker.lorem.word() }] }
			}))
		};

		const parsedWorkoutExercises = parseWorkoutExercises(
			workout as unknown as Parameters<typeof parseWorkoutExercises>[0]
		);

		workout.exercises.forEach(
			(
				{
					exercise: {
						i18n: [{ name }]
					}
				},
				index
			) => {
				expect(parsedWorkoutExercises.exercises[index].exercise.name).toBe(name);
			}
		);
	});
});
