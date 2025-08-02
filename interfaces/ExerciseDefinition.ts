import { ExerciseCategory } from "@/enums/exercise-category";
import ExerciseExperience from "./ExerciseExperience";

export default interface ExerciseDefinition {
    id: string;
    name: string;
    categories: ExerciseCategory[];
    notes: string;
    experience: ExerciseExperience;
    howTo: string | undefined;
    restTimerDurationSeconds?: number;
    oneRepMaxInKg?: number;
    estimatedOneRepMaxInKg?: number;
    maxVolumeInKg?: number;
}