export default interface ExercisePerformanceData {
    exerciseId: string;
    sets: SetPerformanceData[];
    date: number;
    notes: string | null;
}

export interface SetPerformanceData {
    reps: number;
    weight: number;
    weightUnit: string;
}