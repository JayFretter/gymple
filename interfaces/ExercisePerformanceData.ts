import { WeightUnit } from "@/enums/weight-unit";

export default interface ExercisePerformanceData {
    sessionId: string | null;
    exerciseId: string;
    sets: SetPerformanceData[];
    date: number;
    notes: string | null;
}

export interface SetPerformanceData {
    reps: number;
    weight: number;
    weightUnit: WeightUnit;
}