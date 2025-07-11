export interface SessionDefinition {
    sessionDateTimeTicks: number;
    workoutId: string;
    totalSeconds: number;
    exercises: SessionExercise[]
}

interface SessionExercise {
    exerciseId: string;
    exerciseName: string;
}