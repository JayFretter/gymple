export interface SessionDefinition {
    id: string;
    timestamp: number;
    workoutId: string;
    workoutName: string;
    duration: number;
    exercises: SessionExercise[]
}

interface SessionExercise {
    exerciseId: string;
    exerciseName: string;
}