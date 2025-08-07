import { AchievementType } from "@/enums/achievement-type";
import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import useCalculateMaxes from "./useCalculateMaxes";
import useCalculateVolume from "./useCalculateVolume";
import useOngoingWorkoutStore from "./useOngoingWorkoutStore";
import useStorage from "./useStorage";
import { WeightUnit } from "@/enums/weight-unit";
import Achievement from "@/interfaces/Achievement";


export default function useAchievements() {
  const calculateMaxes = useCalculateMaxes();
  const calculateVolume = useCalculateVolume();
  const ongoingSessionId = useOngoingWorkoutStore(state => state.sessionId);
  const { fetchFromStorage } = useStorage();

  const getAchievmentsForPerformance = (performanceThisSession: ExercisePerformanceData): Achievement[] => {
    const exercises = fetchFromStorage<ExerciseDefinition[]>('data_exercises');
    if (!exercises) {
      return [];
    }

    const currentExercise = exercises.find(exercise => exercise.id === performanceThisSession.exerciseId);

    if (!currentExercise) {
      return [];
    }

    const achievements: Achievement[] = [];
    const [sessionHeaviestWeightInKg, sessionEstimated1rmInKg] = calculateMaxes(performanceThisSession, WeightUnit.KG);
    const currentTimestamp = Date.now();

    if (currentExercise.estimatedOneRepMaxInKg !== undefined && currentExercise.maxVolumeInKg !== undefined) {
      if (sessionHeaviestWeightInKg > (currentExercise.heaviestWeightInKg ?? 0)) {
        achievements.push({
          sessionId: ongoingSessionId ?? null,
          type: AchievementType.HeaviestWeight,
          exerciseId: performanceThisSession.exerciseId,
          value: {
            weight: sessionHeaviestWeightInKg
          },
          previousValue: {
            weight: currentExercise.heaviestWeightInKg ?? 0
          },
          timestamp: currentTimestamp
        });
      }

      if (sessionEstimated1rmInKg > (currentExercise.estimatedOneRepMaxInKg ?? 0)) {
        achievements.push({
          sessionId: ongoingSessionId ?? null,
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

      const totalVolumeInKg = calculateVolume(performanceThisSession.sets, WeightUnit.KG);
      if (totalVolumeInKg > (currentExercise.maxVolumeInKg ?? 0)) {
        achievements.push({
          sessionId: ongoingSessionId ?? null,
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
      achievements.push({
        sessionId: ongoingSessionId ?? null,
        type: AchievementType.FirstTime,
        exerciseId: performanceThisSession.exerciseId,
        value: {},
        previousValue: {},
        timestamp: currentTimestamp
      });
    }

    return achievements;
  }

  return { getAchievmentsForPerformance }
}