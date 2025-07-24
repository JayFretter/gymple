import { ExerciseCategory } from "@/enums/exercise-category";

export default interface ExerciseDefinition {
    id: string;
    name: string;
    categories: ExerciseCategory[];
    notes: string;
    restTimerDurationSeconds?: number;
    oneRepMaxInKg?: number;
    estimatedOneRepMaxInKg?: number;
    maxVolumeInKg?: number;
}