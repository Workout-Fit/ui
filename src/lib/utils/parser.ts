import type { WorkoutExercise } from '$lib/types';

export const parseWorkoutExercises = <T>(
	workout: T & {
		exercises: { exercise: { i18n: { name: string }[] } }[];
	}
) =>
	({
		...workout,
		exercises: workout.exercises.map((exercise) => ({
			...exercise,
			exercise: { ...exercise.exercise, name: exercise.exercise.i18n[0].name }
		}))
	}) as T & {
		exercises: WorkoutExercise[];
	};
