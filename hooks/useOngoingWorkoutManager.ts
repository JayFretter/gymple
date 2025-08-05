import { WeightUnit } from "@/enums/weight-unit";
import Achievement from "@/interfaces/Achievement";
import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import GoalDefinition from "@/interfaces/GoalDefinition";
import { SessionDefinition } from "@/interfaces/SessionDefinition";
import WorkoutDefinition from "@/interfaces/WorkoutDefinition";
import { addStreakDay } from "@/utils/workoutStreak";
import useCalculateGoalPerformance from "./useCalculateGoalPerformance";
import useCalculateVolume from "./useCalculateVolume";
import useOngoingWorkoutStore from "./useOngoingWorkoutStore";
import useStorage from "./useStorage";
import useUpdateCurrentWorkoutAchievements from "./useUpdateCurrentWorkoutAchievements";
import useUpdateExerciseMaxes from "./useUpdateExerciseMaxes";
import useUpsertGoal from "./useUpsertGoal";

export interface OngoingWorkoutManager {
  startWorkout: (workout: WorkoutDefinition) => void;
  endWorkout: () => void;
  resetWorkout: () => void;
  generateExerciseIdToVolumeMap: () => Map<string, number>;
  ongoingWorkoutId: string | undefined;
  ongoingWorkoutName: string | undefined;
  ongoingWorkoutExerciseIds: string[];
  completedExercises: string[];
  ongoingWorkoutStartedTimestamp?: number;
  performanceData: ExercisePerformanceData[];
  achievements: Achievement[];
  completedGoals: GoalDefinition[];
}

export default function useOngoingWorkoutManager(): OngoingWorkoutManager {
  const achievements = useOngoingWorkoutStore(state => state.achievements);
  const setWorkoutStartedTimestamp = useOngoingWorkoutStore(state => state.setWorkoutStartedTimestamp);
  const setWorkoutFinishedTimestamp = useOngoingWorkoutStore(state => state.setWorkoutFinishedTimestamp);
  const setOngoingWorkout = useOngoingWorkoutStore(state => state.setWorkout);
  const resetWorkoutId = useOngoingWorkoutStore(state => state.resetWorkoutId);
  const workoutStartedTimestamp = useOngoingWorkoutStore(state => state.workoutStartedTimestamp);
  const ongoingWorkoutId = useOngoingWorkoutStore(state => state.workoutId);
  const ongoingSessionId = useOngoingWorkoutStore(state => state.sessionId);
  const ongoingWorkoutName = useOngoingWorkoutStore(state => state.workoutName);
  const ongoingWorkoutExerciseIds = useOngoingWorkoutStore(state => state.exerciseIds);
  const performanceData = useOngoingWorkoutStore(state => state.performanceData);
  const completedExercises = performanceData.map(exercise => exercise.exerciseId);
  const resetOngoingWorkoutState = useOngoingWorkoutStore(state => state.resetAll);
  const addCompletedGoal = useOngoingWorkoutStore(state => state.addCompletedGoal);
  const completedGoals = useOngoingWorkoutStore(state => state.completedGoals);

  const { fetchFromStorage, setInStorage } = useStorage();
  const calculateVolume = useCalculateVolume();
  const updateExerciseMaxes = useUpdateExerciseMaxes();
  const updateCurrentWorkoutAchievements = useUpdateCurrentWorkoutAchievements();
  const { calculateGoalPercentageFromPerformance } = useCalculateGoalPerformance();
  const upsertGoal = useUpsertGoal();


  const startWorkout = (workout: WorkoutDefinition) => {
    resetOngoingWorkoutState();
    setWorkoutStartedTimestamp(Date.now());
    setOngoingWorkout(workout);
  };

  const endWorkout = () => {
    resetWorkoutId();
    setWorkoutFinishedTimestamp(Date.now());

    const exerciseList = fetchFromStorage<ExerciseDefinition[]>('data_exercises') || [];
    savePerformanceData();
    saveSession(exerciseList);

    const allAchievements = fetchFromStorage<Achievement[]>('data_achievements') || [];
    setInStorage('data_achievements', [...allAchievements, ...achievements]);

    performanceData.forEach(performance => {
      updateExerciseMaxes(performance);
    });

    addStreakDay('workout');
  };

  const resetWorkout = () => {
    resetOngoingWorkoutState();
  };

  const savePerformanceData = () => {
    const currentGoals = fetchFromStorage<GoalDefinition[]>('data_goals') ?? [];

    performanceData.forEach(performance => {
      updateCurrentWorkoutAchievements(performance);

      const relatedGoals = currentGoals.filter(g => g.associatedExerciseId === performance.exerciseId);
      relatedGoals.forEach(g => {
        updateGoalPerformance(g, performance);
      })

      const existingData = fetchFromStorage<ExercisePerformanceData[]>(`data_exercise_${performance.exerciseId}`) ?? [];
      existingData.push(performance);
      setInStorage(`data_exercise_${performance.exerciseId}`, existingData);

    });
  }

  const generateExerciseIdToVolumeMap = () : Map<string, number> => {
    const exerciseIdToVolume = new Map<string, number>();
    performanceData.forEach(performance => {
      const volume = calculateVolume(performance.sets, WeightUnit.KG);
      exerciseIdToVolume.set(performance.exerciseId, volume);
    });
    return exerciseIdToVolume;
  }

  const saveSession = (exerciseList: ExerciseDefinition[]) => {
    if (!ongoingWorkoutId || !ongoingSessionId || !ongoingWorkoutName || !workoutStartedTimestamp) {
      return;
    }

    // Calculate total volume for the session
    let totalVolume = 0;
    performanceData.forEach(performance => {
      totalVolume += calculateVolume(performance.sets, WeightUnit.KG);
    });

    const session: SessionDefinition = {
      id: ongoingSessionId,
      timestamp: Date.now(),
      workoutId: ongoingWorkoutId,
      workoutName: ongoingWorkoutName,
      duration: Date.now() - workoutStartedTimestamp,
      exercises: performanceData.map(performance => ({
        exerciseId: performance.exerciseId,
        exerciseName: exerciseList.find(ex => ex.id === performance.exerciseId)?.name || 'Unknown Exercise'
      })),
      volumeInKg: totalVolume
    };

    setInStorage('data_sessions', [...(fetchFromStorage<SessionDefinition[]>('data_sessions') || []), session]);
  }

  const updateGoalPerformance = (goal: GoalDefinition, performance: ExercisePerformanceData) => {
    if (goal.percentage >= 100) {
      return;
    }

    const newGoalPercentage = calculateGoalPercentageFromPerformance(goal, performance);
    if (newGoalPercentage > goal.percentage) {
      goal.percentage = newGoalPercentage;
      upsertGoal(goal);

      if (newGoalPercentage >= 100) {
        addCompletedGoal(goal);
      }
    }
  }

  return {
    startWorkout,
    endWorkout,
    resetWorkout,
    generateExerciseIdToVolumeMap,
    ongoingWorkoutId,
    ongoingWorkoutName,
    ongoingWorkoutExerciseIds,
    completedExercises,
    ongoingWorkoutStartedTimestamp: workoutStartedTimestamp,
    performanceData,
    achievements,
    completedGoals
  };
}