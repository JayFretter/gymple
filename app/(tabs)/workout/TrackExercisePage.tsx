import GoalBoard from '@/components/GoalBoard';
import PerformanceChart from '@/components/PerformanceChart';
import RestTimer from '@/components/RestTimer';
import Accordion from '@/components/shared/Accordion';
import BgView from '@/components/shared/BgView';
import EditableTimer from '@/components/shared/EditableTimer';
import ExerciseRecordList from '@/components/shared/ExerciseRecordList';
import GradientPressable from '@/components/shared/GradientPressable';
import PopUp from '@/components/shared/PopUp';
import SetsList from '@/components/shared/SetsList';
import { WeightUnit } from '@/enums/weight-unit';
import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import useFetchAssociatedGoalsForExercise from '@/hooks/useFetchAssociatedGoalsForExercise';
import useOngoingWorkoutStore from '@/hooks/useOngoingWorkoutStore';
import useStorage from '@/hooks/useStorage';
import useUserPreferences from '@/hooks/useUserPreferences';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import ExercisePerformanceData, { SetPerformanceData } from '@/interfaces/ExercisePerformanceData';
import GoalDefinition from '@/interfaces/GoalDefinition';
import UserPreferences from '@/interfaces/UserPreferences';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

const TrackExercisePage = () => {
  const params = useLocalSearchParams();
  const [sets, setSets] = useState<SetPerformanceData[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDefinition | null>(null);
  const [sessionNotes, setSessionNotes] = useState<string | null>(null);
  const { fetchFromStorage, setInStorage } = useStorage();

  const [historicPerformanceData, setHistoricPerformanceData] = useState<ExercisePerformanceData[]>([]);
  const previousSessionSets = useMemo(() => {
    const last = historicPerformanceData[historicPerformanceData.length - 1];
    return last?.sets ?? [];
  }, [historicPerformanceData]);

  const [getUserPreferences] = useUserPreferences();
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(WeightUnit.KG);
  const [restTimerDurationSeconds, setRestTimerDurationSeconds] = useState(0);
  const isFocused = useIsFocused();
  const [associatedGoals, setAssociatedGoals] = useState<GoalDefinition[]>([]);
  const fetchAssociatedGoalsForExercise = useFetchAssociatedGoalsForExercise();
  const [isRestTimerPopUpVisible, setIsRestTimerPopUpVisible] = useState(false);
  const navigation = useNavigation();

  const {
    ongoingWorkoutId,
    addPerformanceToOngoingWorkout,
    removePerformanceFromOngoingWorkout,
    ongoingWorkoutPerformanceData,
    ongoingWorkoutExerciseIds,
    ongoingSessionId
  } = useOngoingWorkoutStore(
    useShallow((state) => ({
      ongoingWorkoutId: state.workoutId,
      addPerformanceToOngoingWorkout: state.addPerformanceData,
      removePerformanceFromOngoingWorkout: state.removePerformanceData,
      ongoingWorkoutPerformanceData: state.performanceData,
      ongoingWorkoutExerciseIds: state.exerciseIds,
      ongoingSessionId: state.sessionId
    })),
  );

  useEffect(() => {
    const exerciseId = params.exerciseId as string;

    const exercise = getExerciseDefinition(exerciseId);
    setSelectedExercise(exercise ?? null);
    getHistoricPerformanceData(exerciseId);

    const exerciseDataInWorkout = ongoingWorkoutPerformanceData.find((data) => data.exerciseId === exerciseId);
    console.log('Exercise data in ongoing workout:', exerciseDataInWorkout);

    if (exerciseDataInWorkout) {
      setSets(exerciseDataInWorkout.sets);
      setSessionNotes(exerciseDataInWorkout.notes);
    } else {
      setSessionNotes(null);
    }
  }, []);

  useEffect(() => {
    if (isFocused && selectedExercise) {
      const goals = fetchAssociatedGoalsForExercise(selectedExercise.id);
      setAssociatedGoals(goals);

      const userPreferences = getUserPreferences();
      setUserPreferences(userPreferences);
      setWeightUnit(userPreferences.weightUnit);
      setRestTimerDurationSeconds(selectedExercise.restTimerDurationSeconds ?? userPreferences.defaultRestTimerDurationSeconds);
    }
  }, [isFocused, selectedExercise]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      saveDataToOngoingWorkout();
    });
    return () => {
      unsubscribe();
    };
  }, [sets, sessionNotes, selectedExercise]);

  const saveDataToOngoingWorkout = () => {
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

  const getExerciseDefinition = (exerciseId: string) => {
    const allExercises = useFetchAllExercises();
    const exercise = allExercises.find(e => e.id === exerciseId);

    if (!exercise)
      return undefined;

    return exercise;
  }

  const getHistoricPerformanceData = (exerciseId: string) => {
    const historicData = fetchFromStorage<ExercisePerformanceData[]>(`data_exercise_${exerciseId}`) ?? [];

    setHistoricPerformanceData(historicData);
  }

  const isExercisePartOfOngoingWorkout = () => {
    return ongoingWorkoutId && selectedExercise && ongoingWorkoutExerciseIds.some(id => id === selectedExercise.id);
  }

  const addSet = useCallback(() => {
    const newSets = [...sets];
    const lastSet = newSets.pop() ?? { type: 'weight', reps: 0, weight: 0, weightUnit: weightUnit };
    setSets([...sets, { ...lastSet }]);
  }, [sets, weightUnit]);

  const removeSet = useCallback((index: number) => {
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  }, [sets]);

  const resetSets = () => {
    setSets([]);
  }

  const handleWeightSelected = useCallback((setIndex: number, value: number) => {
    const newSets = [...sets];
    if (newSets[setIndex].type === 'weight') {
      newSets[setIndex].weight = value;
    }
    setSets(newSets);
  }, [sets]);

  const handleRepsSelected = useCallback((setIndex: number, value: number) => {
    const newSets = [...sets];
    if (newSets[setIndex].type === 'weight') {
      newSets[setIndex].reps = value;
    }
    setSets(newSets);
  }, [sets]);

  const switchWeightUnit = () => {
    const newUnit = weightUnit === WeightUnit.KG ? WeightUnit.LBS : WeightUnit.KG;
    setWeightUnit(newUnit);
    setWeightUnitForAllSets(newUnit);
  }

  const setWeightUnitForAllSets = (unit: WeightUnit) => {
    const updatedSets = sets.map(set => ({
      ...set,
      weightUnit: unit
    }));
    setSets(updatedSets);
  }

  const handleRestTimerPopUpClosed = () => {
    setIsRestTimerPopUpVisible(false);

    // if (restTimerDurationSeconds === userPreferences?.defaultRestTimerDurationSeconds) {
    //   return;
    // }

    const allExercises = fetchFromStorage<ExerciseDefinition[]>('data_exercises') ?? [];
    allExercises.forEach(ex => {
      if (ex.id === selectedExercise?.id) {
        ex.restTimerDurationSeconds = restTimerDurationSeconds;
      }
    })

    setInStorage('data_exercises', allExercises);
  }

  const handleResetTimerToDefault = () => {
    const allExercises = fetchFromStorage<ExerciseDefinition[]>('data_exercises') ?? [];
    allExercises.forEach(ex => {
      if (ex.id === selectedExercise?.id) {
        ex.restTimerDurationSeconds = undefined;
      }
    })

    setInStorage('data_exercises', allExercises);
    setRestTimerDurationSeconds(userPreferences?.defaultRestTimerDurationSeconds ?? 0)
    setIsRestTimerPopUpVisible(false);
  }

  return (
    <BgView>
      <PopUp visible={isRestTimerPopUpVisible} onClose={handleRestTimerPopUpClosed} closeButtonText='Done'>
        <Text className='text-xl text-txt-primary font-semibold text-center mb-4'>Set Rest Timer For This Exercise</Text>
        <EditableTimer
          initialTimeInSeconds={selectedExercise?.restTimerDurationSeconds ?? restTimerDurationSeconds}
          onTimeChanged={(time) => setRestTimerDurationSeconds(time)}
        />
        <GradientPressable className='mt-4' style='gray' onPress={handleResetTimerToDefault}>
          <View className='py-2 px-2'>
            <Text className='text-white font-semibold text-center'>Use Default</Text>
          </View>
        </GradientPressable>
      </PopUp>
      <ScrollView className="px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className='text-txt-primary text-3xl font-bold mb-1 mt-8'>{selectedExercise?.name}</Text>
        {selectedExercise?.howTo && (
          <Accordion className="mt-2" title='How to perform this exercise'>
            <Text className="text-txt-secondary">{selectedExercise.howTo}</Text>
          </Accordion>
        )}
        {selectedExercise?.notes && <Text className='text-txt-secondary text-lg mb-1'>{selectedExercise.notes}</Text>}
        {isExercisePartOfOngoingWorkout() &&
          <View className='flex'>
            <View className="flex-row items-center justify-between mt-8">
              <Text className='text-txt-secondary font-semibold text-2xl'>Sets</Text>
              <GradientPressable style='gray'>
                <Text className="text-txt-secondary text-lg mx-2" onPress={resetSets}>Reset</Text>
              </GradientPressable>
            </View>
            <SetsList
              className='mt-4'
              sets={sets}
              addSet={addSet}
              removeSet={removeSet}
              clearData={resetSets}
              switchWeightUnit={switchWeightUnit}
              weightUnit={weightUnit}
              previousSessionSets={previousSessionSets}
              onWeightChange={handleWeightSelected}
              onRepsChange={handleRepsSelected}
            />
            <ExerciseRecordList className='mt-4' exercise={selectedExercise} currentPerformanceData={sets} />
            <Text className='text-txt-secondary font-semibold text-2xl mt-12'>Notes</Text>
            <TextInput
              className="bg-card text-txt-primary px-2 py-2 rounded-xl mt-4"
              placeholder="Notes about this session..."
              placeholderTextColor="#888"
              value={sessionNotes ?? ''}
              onChangeText={setSessionNotes}
            />
            <Text className='text-txt-secondary font-semibold text-2xl mt-12'>Rest Timer</Text>
            <RestTimer className='mt-4' startSeconds={restTimerDurationSeconds ?? 0} onEditPressed={() => setIsRestTimerPopUpVisible(true)} />
          </View>
        }
        <Text className='text-txt-secondary text-2xl font-semibold mb-2 mt-12 self-start'>Goals</Text>
        <GoalBoard goals={associatedGoals} isForSingleExercise />
        <PerformanceChart performanceData={historicPerformanceData} />
      </ScrollView>
    </BgView>
  );
};

export default TrackExercisePage;