export default interface ExercisePerformanceData {
    exerciseId: string;
    sets: SetPerformanceData[];
    date: number;
}

interface SetPerformanceData {
    reps: number;
    weight: number;
    weightUnit: string;
}