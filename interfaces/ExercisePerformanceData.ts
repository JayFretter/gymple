export default interface ExercisePerformanceData {
    exerciseId: string;
    sets: SetPerformanceData[];
    date: number;
    notes: string | null;
}

interface SetPerformanceData {
    reps: number;
    weight: number;
    weightUnit: string;
}