import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData"
import useCurrentWorkoutStore from "./useCurrentWorkoutStore";
import { AchievementType } from "@/enums/achievement-type";
import useCalculateMaxes from "./useCalculateMaxes";
import { storage } from "@/storage";
import ExerciseDefinition from "@/interfaces/ExerciseDefinition";


export default function useUpdateCurrentWorkoutAchievements() {
    const calculateMaxes = useCalculateMaxes();
    const addAchievement = useCurrentWorkoutStore(state => state.addAchievement);

    const calculateTotalVolumeInKg = (performance: ExercisePerformanceData) => {
        return performance.sets.reduce((total, set) => {
            const weightInKg = set.weightUnit === 'kg' ? set.weight : set.weight / 2.20462; // Convert lbs to kg
            return total + (weightInKg * set.reps);
        }, 0);
    }

    const updateCurrentWorkoutAchievements = (performanceThisSession: ExercisePerformanceData) => {
        const exerciseDataString = storage.getString(`data_exercises`);
        if (!exerciseDataString) {
            return;
        }

        const exercises = JSON.parse(exerciseDataString) as ExerciseDefinition[];
        const currentExercise = exercises.find(exercise => exercise.id === performanceThisSession.exerciseId);
        
        if (!currentExercise) {
            return;
        }

        const [sessionOneRepMaxInKg, sessionEstimated1rmInKg] = calculateMaxes(performanceThisSession, 'kg');

        if (sessionOneRepMaxInKg > (currentExercise.oneRepMaxInKg ?? 0)) {
            addAchievement({
                type: AchievementType.OneRepMax,
                exerciseId: performanceThisSession.exerciseId,
                value: {
                    weight: sessionOneRepMaxInKg
                }
            });
        }

        if (sessionEstimated1rmInKg > (currentExercise.estimatedOneRepMaxInKg ?? 0)) {
            addAchievement({
                type: AchievementType.EstimatedOneRepMax,
                exerciseId: performanceThisSession.exerciseId,
                value: {
                    weight: sessionEstimated1rmInKg
                }
            });
        }

        const totalVolumeInKg = calculateTotalVolumeInKg(performanceThisSession);
        if (totalVolumeInKg > (currentExercise.maxVolumeInKg ?? 0)) {
            addAchievement({
                type: AchievementType.ExerciseVolume,
                exerciseId: performanceThisSession.exerciseId,
                value: {
                    weight: totalVolumeInKg
                }
            });
        }
    }

    return updateCurrentWorkoutAchievements
}