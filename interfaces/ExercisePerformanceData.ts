import { WeightUnit } from "@/enums/weight-unit";

export default interface ExercisePerformanceData {
    sessionId: string | null;
    exerciseId: string;
    sets: SetPerformanceData[];
    date: number;
    notes: string | null;
}

export type SetPerformanceData =
    {
        type: 'weight';
        reps: number;
        weight: number;
        weightUnit: WeightUnit;
    }
    | {
        type: 'distance';
        distance: number;
        distanceUnit: 'm' | 'km' | 'mi';
    }
