import { useState, useEffect } from 'react';
import ExercisePerformanceData, { SetPerformanceData } from '@/interfaces/ExercisePerformanceData';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import GoalDefinition from '@/interfaces/GoalDefinition';
import UserPreferences from '@/interfaces/UserPreferences';
import useOngoingWorkoutStore from '@/hooks/useOngoingWorkoutStore';
import useStorage from '@/hooks/useStorage';
import useUpdateExerciseMaxes from '@/hooks/useUpdateExerciseMaxes';
import useFetchAssociatedGoalsForExercise from '@/hooks/useFetchAssociatedGoalsForExercise';
import useUserPreferences from '@/hooks/useUserPreferences';
import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import { WeightUnit } from '@/enums/weight-unit';
import { DistanceUnit } from '@/enums/distance-unit';

export interface CardioSessionManager {
  performanceData: ExercisePerformanceData[];
  previousSessionSets: SetPerformanceData[];
  selectedExercise: ExerciseDefinition | null;
  sets: SetPerformanceData[];
  sessionNotes: string | null;
  associatedGoals: GoalDefinition[];
  userPreferences: UserPreferences | null;
  distanceUnit: DistanceUnit;
  restTimerDurationSeconds: number;
  setSelectedExercise: (exercise: ExerciseDefinition | null) => void;
  setSets: (sets: SetPerformanceData[]) => void;
  setSessionNotes: (notes: string | null) => void;
  setDistanceUnit: (unit: DistanceUnit) => void;
  setRestTimerDurationSeconds: (seconds: number) => void;
  getHistoricPerformanceData: (exerciseId: string) => void;
  saveWorkout: () => void;
  resetSets: () => void;
}

export function useCardioSessionManager(params: { exerciseId?: string }) : CardioSessionManager {
  const [performanceData, setPerformanceData] = useState<ExercisePerformanceData[]>([]);
  const [previousSessionSets, setPreviousSessionSets] = useState<SetPerformanceData[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDefinition | null>(null);
  const [sets, setSets] = useState<SetPerformanceData[]>([]);
  const [sessionNotes, setSessionNotes] = useState<string | null>(null);
  const [associatedGoals, setAssociatedGoals] = useState<GoalDefinition[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(DistanceUnit.KM);
  const [restTimerDurationSeconds, setRestTimerDurationSeconds] = useState(0);

  const { fetchFromStorage, setInStorage } = useStorage();
  const addPerformanceToOngoingWorkout = useOngoingWorkoutStore(state => state.addPerformanceData);
  const removePerformanceFromOngoingWorkout = useOngoingWorkoutStore(state => state.removePerformanceData);
  const ongoingWorkoutPerformanceData = useOngoingWorkoutStore(state => state.performanceData);
  const ongoingSessionId = useOngoingWorkoutStore(state => state.sessionId);
  const updateExerciseMaxes = useUpdateExerciseMaxes();
  const fetchAssociatedGoalsForExercise = useFetchAssociatedGoalsForExercise();
  const [getUserPreferences] = useUserPreferences();
  const getAllExercises = useFetchAllExercises;

  useEffect(() => {
    if (params.exerciseId) {
      const allExercises = getAllExercises();
      const exercise = allExercises.find(e => e.id === params.exerciseId);
      setSelectedExercise(exercise ?? null);
      getHistoricPerformanceData(params.exerciseId);
      const exerciseDataInWorkout = ongoingWorkoutPerformanceData.find((data) => data.exerciseId === params.exerciseId);
      if (exerciseDataInWorkout) {
        setSets(exerciseDataInWorkout.sets);
        setSessionNotes(exerciseDataInWorkout.notes);
      } else {
        setSets([]);
        setSessionNotes(null);
      }
    }
  }, [params.exerciseId]);

  useEffect(() => {
    if (selectedExercise) {
      const goals = fetchAssociatedGoalsForExercise(selectedExercise.id);
      setAssociatedGoals(goals);
      const userPrefs = getUserPreferences();
      setUserPreferences(userPrefs);
      setDistanceUnit(userPrefs.distanceUnit);
      setRestTimerDurationSeconds(selectedExercise.restTimerDurationSeconds ?? userPrefs.defaultRestTimerDurationSeconds);
    }
  }, [selectedExercise]);

  const getHistoricPerformanceData = (exerciseId: string) => {
    const historicData = fetchFromStorage<ExercisePerformanceData[]>(`data_exercise_${exerciseId}`) ?? [];
    setPerformanceData(historicData);
    getPreviousSessionSets(historicData);
  };

  const getPreviousSessionSets = (historicData: ExercisePerformanceData[]) => {
    const lastSessionPerformance = historicData[historicData.length - 1];
    setPreviousSessionSets(lastSessionPerformance?.sets ?? []);
  };

  const saveWorkout = () => {
    if (!selectedExercise) {
      return;
    }
    if (sets.length === 0) {
      removePerformanceFromOngoingWorkout(selectedExercise.id);
      return;
    }
    const workoutData: ExercisePerformanceData = {
      sessionId: ongoingSessionId ?? null,
      exerciseId: selectedExercise.id,
      sets: sets,
      date: new Date().getTime(),
      notes: sessionNotes
    };
    addPerformanceToOngoingWorkout(workoutData);
  };

  const resetSets = () => {
    setSets([]);
  };

  return {
    performanceData,
    previousSessionSets,
    selectedExercise,
    sets,
    sessionNotes,
    associatedGoals,
    userPreferences,
    distanceUnit,
    restTimerDurationSeconds,
    setSelectedExercise,
    setSets,
    setSessionNotes,
    setDistanceUnit,
    setRestTimerDurationSeconds,
    getHistoricPerformanceData,
    saveWorkout,
    resetSets,
  };
}
