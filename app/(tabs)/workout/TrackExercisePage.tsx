import GoalBoard from '@/components/GoalBoard';
import PerformanceChart from '@/components/PerformanceChart';
import RestTimer from '@/components/RestTimer';
import Accordion from '@/components/shared/Accordion';
import EditableTimer from '@/components/shared/EditableTimer';
import GradientPressable from '@/components/shared/GradientPressable';
import PopUp from '@/components/shared/PopUp';
import RecordCard from '@/components/shared/RecordCard';
import SetsList from '@/components/shared/SetsList';
import { WeightAndRepsPickerLarge } from '@/components/shared/WeightAndRepsPickerLarge';
import { WeightUnit } from '@/enums/weight-unit';
import useCalculate1RepMax from '@/hooks/useCalculate1RepMax';
import useCalculateVolume from '@/hooks/useCalculateVolume';
import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import useFetchAssociatedGoalsForExercise from '@/hooks/useFetchAssociatedGoalsForExercise';
import useOngoingWorkoutStore from '@/hooks/useOngoingWorkoutStore';
import useStorage from '@/hooks/useStorage';
import useUpdateExerciseMaxes from '@/hooks/useUpdateExerciseMaxes';
import useUserPreferences from '@/hooks/useUserPreferences';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import ExercisePerformanceData, { SetPerformanceData } from '@/interfaces/ExercisePerformanceData';
import GoalDefinition from '@/interfaces/GoalDefinition';
import UserPreferences from '@/interfaces/UserPreferences';
import { roundHalf } from '@/utils/maths-utils';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { JSX, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

const TrackExercisePage = () => {
  const [performanceData, setPerformanceData] = useState<ExercisePerformanceData[]>([]);
  const [previousSessionSets, setPreviousSessionSets] = useState<SetPerformanceData[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDefinition | null>(null);
  const [dueToSave, setDueToSave] = useState(false);
  const [sets, setSets] = useState([{ reps: 0, weight: 0, weightUnit: WeightUnit.KG }]);
  const [sessionNotes, setSessionNotes] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();
  const { fetchFromStorage, setInStorage } = useStorage();

  const [isSetPopUpVisible, setIsSetPopUpVisible] = useState(false);
  const [selectedSetIndex, setSelectedSetIndex] = useState<number>(0);

  const [isTimerPopUpVisible, setIsTimerPopUpVisible] = useState(false);

  const ongoingWorkoutId = useOngoingWorkoutStore(state => state.workoutId);
  const addPerformanceToOngoingWorkout = useOngoingWorkoutStore(state => state.addPerformanceData);
  const ongoingWorkoutPerformanceData = useOngoingWorkoutStore(state => state.performanceData);
  const ongoingWorkoutExerciseIds = useOngoingWorkoutStore(state => state.exerciseIds);
  const ongoingSessionId = useOngoingWorkoutStore(state => state.sessionId);

  const updateExerciseMaxes = useUpdateExerciseMaxes();

  const [associatedGoals, setAssociatedGoals] = useState<GoalDefinition[]>([]);
  const fetchAssociatedGoalsForExercise = useFetchAssociatedGoalsForExercise();


  const [getUserPreferences] = useUserPreferences();
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(WeightUnit.KG);

  const [restTimerDurationSeconds, setRestTimerDurationSeconds] = useState(0);

  const calculateVolume = useCalculateVolume();
  const calculateOneRepMax = useCalculate1RepMax();

  const navigation = useNavigation();

  useEffect(() => {
    if (!isExercisePartOfOngoingWorkout()) return;

    navigation.setOptions({
      headerRight: () => (
        <Pressable className='active:opacity-75' onPress={() => setDueToSave(true)}>
          <Text className="text-blue-500 font-semibold text-lg">Finished</Text>
        </Pressable>
      )
    })
  }, [navigation, ongoingWorkoutId, selectedExercise, ongoingWorkoutExerciseIds])

  useEffect(() => {
    if (dueToSave) {
      saveWorkout();
      setDueToSave(false);
    }
  }, [dueToSave])

  useEffect(() => {
    const exerciseId = params.exerciseId as string;
    const exercise = getExerciseDefinition(exerciseId);
    setSelectedExercise(exercise ?? null);
    getHistoricPerformanceData(exerciseId);

    const userPreferences = getUserPreferences();
      setUserPreferences(userPreferences);
      setWeightUnit(userPreferences.weightUnit);
      setRestTimerDurationSeconds(exercise?.restTimerDurationSeconds ?? userPreferences.defaultRestTimerDurationSeconds);

    setSets([{ reps: 0, weight: 0, weightUnit: userPreferences.weightUnit }]);
    setSelectedSetIndex(0);
    setSessionNotes(null);
  }, []);

  useEffect(() => {
    if (isFocused && selectedExercise) {
      const goals = fetchAssociatedGoalsForExercise(selectedExercise.id);
      setAssociatedGoals(goals);

      const exerciseDataInWorkout = ongoingWorkoutPerformanceData.find((data) => data.exerciseId === selectedExercise.id);

      if (exerciseDataInWorkout) {
        setSets(exerciseDataInWorkout.sets);
        setSessionNotes(exerciseDataInWorkout.notes);
      }
    }
  }, [isFocused, ongoingWorkoutPerformanceData, selectedExercise]);

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

  const getExerciseDefinition = (exerciseId: string) => {
    const allExercises = useFetchAllExercises();
    const exercise = allExercises.find(e => e.id === exerciseId);

    if (!exercise)
      return undefined;

    return exercise;
  }

  const addSet = () => {
    const newSets = [...sets];
    const lastSet = newSets.pop() ?? { reps: 0, weight: 0, weightUnit: weightUnit };
    setSets([...sets, { ...lastSet }]);
  };

  const removeSet = (index: number) => {
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  };

  const saveWorkout = () => {
    if (!selectedExercise) {
      console.error('No exercise selected to save workout data.');
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

    if (!ongoingWorkoutId) {
      updateExerciseMaxes(workoutData);

      const existingData = fetchFromStorage<ExercisePerformanceData[]>(`data_exercise_${selectedExercise.id}`) ?? [];
      existingData.push(workoutData);
      setInStorage(`data_exercise_${selectedExercise.id}`, existingData);
    }

    router.back();
  };

  const clearData = () => {
    setSets([{ reps: 0, weight: 0, weightUnit: WeightUnit.KG }]);
  }

  const handleWeightSelected = (value: number, setIndex: number) => {
    const newSets = [...sets];
    newSets[setIndex].weight = value;
    setSets(newSets);
  }

  const handleRepsSelected = (value: number, setIndex: number) => {
    const newSets = [...sets];
    newSets[setIndex].reps = value;
    setSets(newSets);
  }

  const getHistoricPerformanceData = (exerciseId: string) => {
    const historicData = fetchFromStorage<ExercisePerformanceData[]>(`data_exercise_${exerciseId}`) ?? [];

    setPerformanceData(historicData);
    getPreviousSessionSets(historicData);
  }

  const handleSetSelected = (index: number) => {
    setSelectedSetIndex(index);
    setIsSetPopUpVisible(true);
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
    setIsTimerPopUpVisible(false);
  }

  const handleTimerPopUpClosed = () => {
    setIsTimerPopUpVisible(false);

    if (restTimerDurationSeconds === userPreferences?.defaultRestTimerDurationSeconds) {
      return;
    }

    const allExercises = fetchFromStorage<ExerciseDefinition[]>('data_exercises') ?? [];
    allExercises.forEach(ex => {
      if (ex.id === selectedExercise?.id) {
        ex.restTimerDurationSeconds = restTimerDurationSeconds;
      }
    })

    setInStorage('data_exercises', allExercises);
  }

  const isExercisePartOfOngoingWorkout = () => {
    return ongoingWorkoutId && selectedExercise && ongoingWorkoutExerciseIds.some(id => id === selectedExercise.id);
  }

  const getPreviousSessionSets = (historicData: ExercisePerformanceData[]) => {
    const lastSessionPerformance = historicData[historicData.length - 1];
    setPreviousSessionSets(lastSessionPerformance?.sets ?? []);
  }

  const atLeastOneSetCompleted = () => {
    return sets.some(set => set.reps > 0);
  }

  const renderNewRecords = () => {
    if (performanceData.length === 0 && atLeastOneSetCompleted()) {
      return (
        <RecordCard className='mt-4' title='1st time performing exercise' />
      );
    }

    const records: JSX.Element[] = [];

    const oldVolume = roundHalf(selectedExercise?.maxVolumeInKg ?? 0);
    const newVolume = roundHalf(calculateVolume(sets, WeightUnit.KG));
    if (newVolume > oldVolume) {
      records.push(
        <RecordCard title='New volume record!' oldValue={oldVolume} newValue={newVolume} />
      );
    }

    const oldEstimated1rm = roundHalf(selectedExercise?.estimatedOneRepMaxInKg ?? 0);
    const newEstimated1rm = roundHalf(calculateOneRepMax(sets, WeightUnit.KG));
    if (newEstimated1rm > oldEstimated1rm) {
      records.push(
        <RecordCard title='New estimated 1 rep max!' oldValue={oldEstimated1rm} newValue={newEstimated1rm} />
      );
    }

    return (
      <View className='mt-4 flex gap-2'>
        {records.map((record, index) => (
          <View key={index}>
            {record}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View className='flex-1'>
      <PopUp visible={isSetPopUpVisible} onClose={() => setIsSetPopUpVisible(false)} closeButtonText='Done' >
        <View className="flex-row justify-between items-center mx-4 mb-4">
          <Text className="text-center text-txt-primary font-bold text-xl">Set {selectedSetIndex + 1}</Text>
          {(sets[selectedSetIndex]) &&
            <WeightAndRepsPickerLarge
              onWeightSelected={(value) => handleWeightSelected(value, selectedSetIndex)}
              onRepsSelected={(value) => handleRepsSelected(value, selectedSetIndex)}
              weightUnit={weightUnit}
              placeholderWeight={sets[selectedSetIndex].weight}
              placeholderReps={sets[selectedSetIndex].reps}
              onFormComplete={() => setIsSetPopUpVisible(false)}
            />
          }
        </View>
      </PopUp>
      <PopUp visible={isTimerPopUpVisible} onClose={handleTimerPopUpClosed} closeButtonText='Done'>
        <Text className='text-xl text-txt-primary font-semibold text-center mb-4'>Set Rest Timer For This Exercise</Text>
        <EditableTimer
          initialTimeInSeconds={selectedExercise?.restTimerDurationSeconds ?? userPreferences?.defaultRestTimerDurationSeconds}
          onTimeChanged={(time) => setRestTimerDurationSeconds(time)}
        />
        <GradientPressable className='mt-4' style='gray' onPress={handleResetTimerToDefault}>
          <View className='py-2 px-2'>
            <Text className='text-white font-semibold text-center'>Use Default</Text>
          </View>
        </GradientPressable>
      </PopUp>
      <ScrollView className="flex-1 px-4 bg-primary" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className='text-txt-primary text-3xl font-bold mb-1 mt-8'>{selectedExercise?.name}</Text>
        {selectedExercise?.howTo && (
          <Accordion className="mt-2" title='How to perform this exercise'>
            <Text className="text-txt-secondary">{selectedExercise.howTo}</Text>
          </Accordion>
        )}
        {selectedExercise?.notes && <Text className='text-txt-secondary text-lg mb-1'>{selectedExercise.notes}</Text>}
        {isExercisePartOfOngoingWorkout() &&
          <View className='flex'>
            <Text className='text-txt-secondary font-semibold text-2xl mt-8'>Sets</Text>
            <SetsList
              className='mt-4'
              sets={sets}
              addSet={addSet}
              removeSet={removeSet}
              clearData={clearData}
              handleSetSelected={handleSetSelected}
              switchWeightUnit={switchWeightUnit}
              weightUnit={weightUnit}
              previousSessionSets={previousSessionSets}
            />
            {renderNewRecords()}
            <Text className='text-txt-secondary font-semibold text-2xl mt-12'>Notes</Text>
            <TextInput
              className="bg-card text-txt-primary px-2 py-2 rounded-xl mt-4"
              placeholder="Notes about this session..."
              placeholderTextColor="#888"
              value={sessionNotes ?? ''}
              onChangeText={setSessionNotes}
            />
            <Text className='text-txt-secondary font-semibold text-2xl mt-12'>Rest Timer</Text>
            <RestTimer className='mt-4' startSeconds={restTimerDurationSeconds ?? 0} onEditPressed={() => setIsTimerPopUpVisible(true)} />
          </View>
        }
        <Text className='text-txt-secondary text-2xl font-semibold mb-2 mt-12 self-start'>Goals</Text>
        <GoalBoard goals={associatedGoals} isForSingleExercise />
        <PerformanceChart performanceData={performanceData} />
      </ScrollView>
    </View>
  );
};

export default TrackExercisePage;