import CardioPerformanceChart from '@/components/CardioPerformanceChart';
import GoalBoard from '@/components/GoalBoard';
import PerformanceChart from '@/components/PerformanceChart';
import RestTimer from '@/components/RestTimer';
import Accordion from '@/components/shared/Accordion';
import BgView from '@/components/shared/BgView';
import { DistancePickerLarge } from '@/components/shared/DistancePickerLarge';
import EditableTimer from '@/components/shared/EditableTimer';
import GradientPressable from '@/components/shared/GradientPressable';
import PopUp from '@/components/shared/PopUp';
import RecordCard from '@/components/shared/RecordCard';
import SetsList from '@/components/shared/SetsList';
import { WeightAndRepsPickerLarge } from '@/components/shared/WeightAndRepsPickerLarge';
import { DistanceUnit } from '@/enums/distance-unit';
import { WeightUnit } from '@/enums/weight-unit';
import useCalculate1RepMax from '@/hooks/useCalculate1RepMax';
import useCalculateVolume from '@/hooks/useCalculateVolume';
import { useCardioSessionManager } from '@/hooks/useCardioSessionManager';
import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import useOngoingWorkoutStore from '@/hooks/useOngoingWorkoutStore';
import useStorage from '@/hooks/useStorage';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { roundHalf } from '@/utils/maths-utils';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { JSX, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function TrackCardioPage() {
  const params = useLocalSearchParams();
  const { fetchFromStorage, setInStorage } = useStorage();

  const [isSetPopUpVisible, setIsSetPopUpVisible] = useState(false);
  const [selectedSetIndex, setSelectedSetIndex] = useState<number>(0);

  const [isTimerPopUpVisible, setIsTimerPopUpVisible] = useState(false);

  const ongoingWorkoutId = useOngoingWorkoutStore(state => state.workoutId);
  const ongoingWorkoutPerformanceData = useOngoingWorkoutStore(state => state.performanceData);
  const ongoingWorkoutExerciseIds = useOngoingWorkoutStore(state => state.exerciseIds);

  const {
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
  } = useCardioSessionManager({ exerciseId: params.exerciseId as string, setCount: parseInt(params.setCount as string) });

  const calculateVolume = useCalculateVolume();
  const calculateOneRepMax = useCalculate1RepMax();

  const navigation = useNavigation();

  useEffect(() => {
    if (!isExercisePartOfOngoingWorkout()) return;

    navigation.setOptions({
      headerRight: () => (
        <Pressable className='active:opacity-75' onPress={() => router.back()}>
          <Text className="text-blue-500 font-semibold text-lg">Finished</Text>
        </Pressable>
      )
    })
  }, [navigation, ongoingWorkoutId, selectedExercise, ongoingWorkoutExerciseIds])

  useEffect(() => {
    saveWorkout();
  }, [sets, sessionNotes])

  useEffect(() => {
    const exerciseId = params.exerciseId as string;
    const exercise = getExerciseDefinition(exerciseId);
    setSelectedExercise(exercise ?? null);
    getHistoricPerformanceData(exerciseId);

    const exerciseDataInWorkout = ongoingWorkoutPerformanceData.find((data) => data.exerciseId === exerciseId);

    if (exerciseDataInWorkout) {
      setSets(exerciseDataInWorkout.sets);
      setSessionNotes(exerciseDataInWorkout.notes);
    } else {
      setSelectedSetIndex(0);
      setSessionNotes(null);
    }
  }, []);


  const switchDistanceUnit = () => {
    const newUnit = distanceUnit === DistanceUnit.KM ? DistanceUnit.MI : DistanceUnit.KM;
    setDistanceUnit(newUnit);
    setDistanceUnitForAllSets(newUnit);
  }

  const setDistanceUnitForAllSets = (unit: DistanceUnit) => {
    const updatedSets = sets.map(set => ({
      ...set,
      distanceUnit: unit
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
    const lastSet = newSets.pop() ?? { type: 'distance', distance: 0, distanceUnit: distanceUnit };
    setSets([...sets, { ...lastSet }]);
  };

  const removeSet = (index: number) => {
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  };

  const handleDistanceSelected = (value: number, setIndex: number) => {
    const newSets = [...sets];
    if (newSets[setIndex].type === 'distance') {
      newSets[setIndex].distance = value;
    }
    setSets(newSets);
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

  const atLeastOneSetCompleted = () => {
    return sets.filter(s => s.type === 'distance').some(set => set.distance > 0);
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
    <BgView>
      <PopUp visible={isSetPopUpVisible} onClose={() => setIsSetPopUpVisible(false)} closeButtonText='Done' >
        <View className="flex-row justify-between items-center mx-4">
          <Text className="text-center text-txt-primary font-bold text-xl">Set {selectedSetIndex + 1}</Text>
          {(sets[selectedSetIndex]?.type === 'distance') &&
            <DistancePickerLarge
              onDistanceSelected={(value) => handleDistanceSelected(value, selectedSetIndex)}
              distanceUnit={distanceUnit}
              placeholderDistance={sets[selectedSetIndex].distance}
              onFormComplete={() => setIsSetPopUpVisible(false)}
            />
          }
        </View>
        {previousSessionSets[selectedSetIndex]?.type === 'distance' &&
          <View className="flex-row justify-between items-center mx-4 mt-2">
            <Text className="text-center text-txt-secondary">Previous:</Text>
            <Text className="text-center text-txt-secondary">
              {previousSessionSets[selectedSetIndex].distance} {previousSessionSets[selectedSetIndex].distanceUnit}
            </Text>
          </View>
        }
        <View className='h-2' />
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
              handleSetSelected={handleSetSelected}
              switchWeightUnit={switchDistanceUnit}
              weightUnit={WeightUnit.KG}
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
        <CardioPerformanceChart performanceData={performanceData} />
      </ScrollView>
    </BgView>
  );
};