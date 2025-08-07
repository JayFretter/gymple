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
  /**
   * Heaviest weight ever used for this exercise (not 1RM, just max single set weight)
   */
  heaviestWeightInKg?: number;
  /**
   * Estimated one rep max (calculated)
   */
  estimatedOneRepMaxInKg?: number;
  maxVolumeInKg?: number;
}