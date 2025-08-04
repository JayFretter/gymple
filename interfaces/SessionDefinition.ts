export interface SessionDefinition {
    id: string;
    timestamp: number;
    workoutId: string;
    workoutName: string;
    duration: number;
    exercises: SessionExercise[];
    volumeInKg: number; // Total volume for the workout session
}

interface SessionExercise {
    exerciseId: string;
    exerciseName: string;
}