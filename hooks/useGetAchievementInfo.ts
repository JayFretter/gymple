import { AchievementType } from "@/enums/achievement-type";

export default function useGetAchievementInfo() {
    const getAchievementName = (achievement: AchievementType): string => {
        switch (achievement) {
            case AchievementType.FirstTime:
                return '1st Timer';
            case AchievementType.OneRepMax:
                return 'Buff Bear';
            case AchievementType.EstimatedOneRepMax:
                return 'Theoretical Titan';
            case AchievementType.ExerciseVolume:
                return 'Upgraded Machinery';
            case AchievementType.TotalVolume:
                return 'Workhorse';
            case AchievementType.PersonalRecord:
                return 'New Heights';
            default:
                return 'Unknown Achievement';
        }
    };

    const getAchievementDescription = (achievement: AchievementType): string => {
        switch (achievement) {
            case AchievementType.FirstTime:
                return 'Complete an exercise for the first time.';
            case AchievementType.OneRepMax:
                return 'Achieve a new personal record for your heaviest weight lifted for one rep of an exercise.';
            case AchievementType.EstimatedOneRepMax:
                return 'Achieve a new estimated one rep max based on your best set of an exercise.';
            case AchievementType.ExerciseVolume:
                return 'Achieve a new personal record for the total volume lifted in an exercise.';
            case AchievementType.TotalVolume:
                return 'Achieve a new personal record for the total volume lifted across all exercises.';
            case AchievementType.PersonalRecord:
                return 'Set a new personal record for any exercise.';
            default:
                return 'No description available for this achievement.';
        }
    };

    return { getAchievementName, getAchievementDescription };
}