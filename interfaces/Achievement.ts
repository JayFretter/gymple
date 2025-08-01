import { AchievementType } from "@/enums/achievement-type";

export interface AchievementValue {
    weight?: number;
    reps?: number;
}

export default interface Achievement {
    sessionId: string | null;
    exerciseId: string;
    type: AchievementType;
    value: AchievementValue;
    previousValue: AchievementValue;
    timestamp: number;
}