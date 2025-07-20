import { AchievementType } from "@/enums/achievement-type";

export interface AchievementValue {
    weight?: number;
    reps?: number;
}

export default interface Achievement {
    exerciseId: string;
    type: AchievementType;
    value: AchievementValue;
}