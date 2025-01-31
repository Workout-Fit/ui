import { signUpFormSchema } from '$routes/auth/+page.svelte';
import type { z } from 'zod';
import { faker } from '@faker-js/faker';
import { workoutFormSchema } from '$lib/forms/WorkoutForm.svelte';
import { exerciseFormSchema } from '$lib/forms/ExerciseForm.svelte';

export const createUser = (
	overrides?: Partial<z.infer<typeof signUpFormSchema>>
): z.infer<typeof signUpFormSchema> => ({
	username: faker.internet.username(),
	full_name: faker.person.fullName(),
	weight: faker.number.int({ min: 100, max: 200 }),
	height: faker.number.int({ min: 150, max: 200 }),
	avatar: new File([], 'avatar.jpg'),
	bio: faker.lorem.sentence(),
	email: faker.internet.email(),
	password: faker.internet.password(),
	...overrides
});

export const createExercise = (overrides?: Partial<z.infer<typeof exerciseFormSchema>>) => ({
	sets: faker.number.int({ min: 2, max: 4 }),
	repetitions: faker.number.int({ min: 8, max: 15 }),
	rest: faker.number.int({ min: 60, max: 120 }),
	notes: faker.lorem.sentence(),
	exercise: { id: faker.string.numeric(10), name: faker.word.words(2) },
	...overrides
});

export const createWorkout = (overrides?: Partial<z.infer<typeof workoutFormSchema>>) => ({
	name: faker.word.words(2),
	notes: faker.lorem.sentence(),
	exercises: faker.helpers.multiple(() => createExercise(), {
		count: faker.number.int({ min: 1, max: 5 })
	}),
	...overrides
});
