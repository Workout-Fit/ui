import { generateMock } from '@anatine/zod-mock';
import { signUpFormSchema } from '$routes/auth/+page.svelte';
import type { z } from 'zod';
import { faker } from '@faker-js/faker';
import { workoutFormSchema } from '$lib/forms/WorkoutForm.svelte';
import { exerciseFormSchema } from '$lib/forms/ExerciseForm.svelte';

export const createUser = (overrides?: Partial<z.infer<typeof signUpFormSchema>>) => ({
	...generateMock(signUpFormSchema),
	username: faker.internet.username(),
	full_name: faker.person.fullName(),
	...overrides
});

export const createWorkout = (overrides?: Partial<z.infer<typeof workoutFormSchema>>) => ({
	...generateMock(workoutFormSchema),
	...overrides
});

export const createExercise = (overrides?: Partial<z.infer<typeof exerciseFormSchema>>) => ({
	...generateMock(exerciseFormSchema),
	...overrides
});
