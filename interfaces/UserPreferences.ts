import { DistanceUnit } from "@/enums/distance-unit";
import { WeightUnit } from "@/enums/weight-unit";

export default interface UserPreferences {
    weightUnit: WeightUnit;
    distanceUnit: DistanceUnit;
    colourScheme: 'light' | 'dark' | 'system';
    defaultRestTimerDurationSeconds: number;
    nutritionTargets?: {
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    };
}