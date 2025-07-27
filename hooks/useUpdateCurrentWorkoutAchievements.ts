import { AchievementType } from "@/enums/achievement-type";
import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import useCalculateMaxes from "./useCalculateMaxes";
import useCalculateVolume from "./useCalculateVolume";
import useOngoingWorkoutStore from "./useOngoingWorkoutStore";
import useStorage from "./useStorage";


export default function useUpdateCurrentWorkoutAchievements() {
  const calculateMaxes = useCalculateMaxes();
  const calculateVolume = useCalculateVolume();
  const addAchievement = useOngoingWorkoutStore(state => state.addAchievement);
  const { fetchFromStorage } = useStorage();

  const updateCurrentWorkoutAchievements = (performanceThisSession: ExercisePerformanceData) => {
    const exercises = fetchFromStorage<ExerciseDefinition[]>('data_exercises');
    if (!exercises) {
      return;
    }

    const currentExercise = exercises.find(exercise => exercise.id === performanceThisSession.exerciseId);

    if (!currentExercise) {
      return;
    }

    const [sessionOneRepMaxInKg, sessionEstimated1rmInKg] = calculateMaxes(performanceThisSession, 'kg');

    const currentTimestamp = Date.now();

    if (sessionOneRepMaxInKg > (currentExercise.oneRepMaxInKg ?? 0)) {
      addAchievement({
        type: AchievementType.OneRepMax,
        exerciseId: performanceThisSession.exerciseId,
        value: {
          weight: sessionOneRepMaxInKg
        },
        previousValue: {
          weight: currentExercise.oneRepMaxInKg ?? 0
        },
        timestamp: currentTimestamp
      });
    }

    if (currentExercise.estimatedOneRepMaxInKg !== undefined && currentExercise.maxVolumeInKg !== undefined) {
      if (sessionEstimated1rmInKg > (currentExercise.estimatedOneRepMaxInKg ?? 0)) {
        addAchievement({
          type: AchievementType.EstimatedOneRepMax,
          exerciseId: performanceThisSession.exerciseId,
          value: {
            weight: sessionEstimated1rmInKg
          },
          previousValue: {
            weight: currentExercise.estimatedOneRepMaxInKg ?? 0
          },
          timestamp: currentTimestamp
        });
      }

      const totalVolumeInKg = calculateVolume(performanceThisSession.sets, 'kg');
      if (totalVolumeInKg > (currentExercise.maxVolumeInKg ?? 0)) {
        addAchievement({
          type: AchievementType.ExerciseVolume,
          exerciseId: performanceThisSession.exerciseId,
          value: {
            weight: totalVolumeInKg
          },
          previousValue: {
            weight: currentExercise.maxVolumeInKg ?? 0
          },
          timestamp: currentTimestamp
        });
      }
    } else {
      addAchievement({
        type: AchievementType.FirstTime,
        exerciseId: performanceThisSession.exerciseId,
        value: {},
        previousValue: {},
        timestamp: currentTimestamp
      });
    }
  }

  return updateCurrentWorkoutAchievements
}