import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData"
import useCurrentWorkoutStore from "./useCurrentWorkoutStore";
import { AchievementType } from "@/enums/achievement-type";
import useCalculateMaxes from "./useCalculateMaxes";
import { storage } from "@/storage";
import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import useCalculateVolume from "./useCalculateVolume";


export default function useUpdateCurrentWorkoutAchievements() {
    const calculateMaxes = useCalculateMaxes();
    const calculateVolume = useCalculateVolume();
    const addAchievement = useCurrentWorkoutStore(state => state.addAchievement);

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
                },
                previousValue: {
                    weight: currentExercise.oneRepMaxInKg ?? 0
                }
            });
        }

        if (sessionEstimated1rmInKg > (currentExercise.estimatedOneRepMaxInKg ?? 0)) {
            addAchievement({
                type: AchievementType.EstimatedOneRepMax,
                exerciseId: performanceThisSession.exerciseId,
                value: {
                    weight: sessionEstimated1rmInKg
                },
                previousValue: {
                    weight: currentExercise.estimatedOneRepMaxInKg ?? 0
                }
            });
        }

        const totalVolumeInKg = calculateVolume(performanceThisSession, 'kg');
        if (totalVolumeInKg > (currentExercise.maxVolumeInKg ?? 0)) {
            addAchievement({
                type: AchievementType.ExerciseVolume,
                exerciseId: performanceThisSession.exerciseId,
                value: {
                    weight: totalVolumeInKg
                },
                previousValue: {
                    weight: currentExercise.maxVolumeInKg ?? 0
                }
            });
        }
    }

    return updateCurrentWorkoutAchievements
}