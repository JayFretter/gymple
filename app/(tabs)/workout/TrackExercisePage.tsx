import GoalBoard from '@/components/GoalBoard';
import PerformanceChart from '@/components/PerformanceChart';
import RestTimer from '@/components/RestTimer';
import EditableTimer from '@/components/shared/EditableTimer';
import GradientPressable from '@/components/shared/GradientPressable';
import PopUp from '@/components/shared/PopUp';
import RecordCard from '@/components/shared/RecordCard';
import SetsList from '@/components/shared/SetsList';
import { WeightAndRepsPickerLarge } from '@/components/shared/WeightAndRepsPickerLarge';
import useCalculateVolume from '@/hooks/useCalculateVolume';
import useOngoingWorkoutStore from '@/hooks/useOngoingWorkoutStore';
import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import useFetchAssociatedGoalsForExercise from '@/hooks/useFetchAssociatedGoalsForExercise';
import useStorage from '@/hooks/useStorage';
import useUpdateExerciseMaxes from '@/hooks/useUpdateExerciseMaxes';
import useUserPreferences from '@/hooks/useUserPreferences';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import ExercisePerformanceData from '@/interfaces/ExercisePerformanceData';
import GoalDefinition from '@/interfaces/GoalDefinition';
import UserPreferences from '@/interfaces/UserPreferences';
import Feather from '@expo/vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { WeightUnit } from '@/enums/weight-unit';

const TrackExercisePage = () => {
  const [performanceData, setPerformanceData] = useState<ExercisePerformanceData[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDefinition | null>(null);
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

  const updateExerciseMaxes = useUpdateExerciseMaxes();

  const [associatedGoals, setAssociatedGoals] = useState<GoalDefinition[]>([]);
  const fetchAssociatedGoalsForExercise = useFetchAssociatedGoalsForExercise();


  const [getUserPreferences] = useUserPreferences();
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(WeightUnit.KG);

  const [restTimerDurationSeconds, setRestTimerDurationSeconds] = useState(0);

  const calculateVolume = useCalculateVolume();

  useEffect(() => {
    if (isFocused) {
      const exerciseId = params.exerciseId as string;
      const exercise = getExerciseDefinition(exerciseId);
      setSelectedExercise(exercise ?? null);
      getExerciseData(exerciseId);

      const goals = fetchAssociatedGoalsForExercise(exerciseId);
      console.log('Associated goals:', goals);
      setAssociatedGoals(goals);

      const userPreferences = getUserPreferences();
      setUserPreferences(userPreferences);
      setWeightUnit(userPreferences.weightUnit);
      setRestTimerDurationSeconds(exercise?.restTimerDurationSeconds ?? userPreferences.defaultRestTimerDurationSeconds);

      const exerciseDataInWorkout = ongoingWorkoutPerformanceData.find((data) => data.exerciseId === exerciseId);

      if (exerciseDataInWorkout) {
        setSets(exerciseDataInWorkout.sets);
        setSessionNotes(exerciseDataInWorkout.notes);
      } else {
        setSets([{ reps: 0, weight: 0, weightUnit: userPreferences.weightUnit }]); // HERE
        setSelectedSetIndex(0);
        setSessionNotes(null);
      }
    }
  }, [isFocused, ongoingWorkoutId]);

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
    if (!selectedExercise)
      return;

    const workoutData: ExercisePerformanceData = {
      sessionId: null, // This will be set later when the session is finalized
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

  const getExerciseData = (exerciseId: string) => {
    const historicData = fetchFromStorage<ExercisePerformanceData[]>(`data_exercise_${exerciseId}`) ?? [];
    console.log('Historic data:', historicData);

    setPerformanceData(historicData);
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

  const renderNewRecords = () => {
    const oldVolume = selectedExercise?.maxVolumeInKg ?? 0;
    const newVolume = calculateVolume(sets, WeightUnit.KG);
    if (newVolume > oldVolume) {
      return (
        <RecordCard title='New volume record!' oldValue={oldVolume} newValue={newVolume} />
      );
    }
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
      <PopUp visible={isTimerPopUpVisible} onClose={handleTimerPopUpClosed} closeButtonText='Done' >
        <Text className='text-xl text-txt-primary font-semibold text-center mb-4'>Set Rest Timer For This Exercise</Text>
        <EditableTimer
          initialTimeInSeconds={selectedExercise?.restTimerDurationSeconds ?? userPreferences?.defaultRestTimerDurationSeconds}
          onTimeChanged={(time) => setRestTimerDurationSeconds(time)}
        />
      </PopUp>
      {isExercisePartOfOngoingWorkout() &&
        <LinearGradient className='flex-row w-full items-center justify-center absolute bottom-0 py-8 z-10' colors={['#00000000', '#22226699']}>
          <GradientPressable
            className='w-[80%]'
            style='default'
            onPress={saveWorkout}
          >
            <Text className="text-white text-lg text-center my-2">Exercise Finished</Text>
          </GradientPressable>
        </LinearGradient>
      }

      <ScrollView className="flex-1 px-4 bg-primary" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className='text-txt-primary text-4xl font-bold mb-1 mt-4'>{selectedExercise?.name}</Text>
        {selectedExercise?.notes && <Text className='text-txt-secondary text-lg mb-1'>{selectedExercise.notes}</Text>}
        {isExercisePartOfOngoingWorkout() &&
          <View className='flex'>
            <SetsList
              className='mt-8 mb-8'
              sets={sets}
              addSet={addSet}
              removeSet={removeSet}
              clearData={clearData}
              handleSetSelected={handleSetSelected}
              switchWeightUnit={switchWeightUnit}
              weightUnit={weightUnit}
            />
            {renderNewRecords()}
            <TextInput
              className="bg-card text-txt-primary px-2 py-4 rounded-xl mb-12"
              placeholder="Notes about this session..."
              placeholderTextColor="#888"
              value={sessionNotes ?? ''}
              onChangeText={setSessionNotes}
            />
            <View className='flex-row items-center justify-between mb-4'>
              <GradientPressable className='' style='gray' onPress={handleResetTimerToDefault}>
                <View className='py-1 px-2'>
                  <Text className='text-white'>Use default time</Text>
                </View>
              </GradientPressable>
              <GradientPressable className='' style='default' onPress={() => setIsTimerPopUpVisible(true)}>
                <View className='flex-row items-center gap-1 py-1 px-2'>
                  {/* <Text className='text-white'>Edit</Text> */}
                  <Feather name="edit-3" size={16} color="white" />
                </View>
              </GradientPressable>
            </View>

            <RestTimer startSeconds={restTimerDurationSeconds ?? 0} />
          </View>
        }
        <View className='mt-8 flex items-center'>
          <Text className='text-txt-primary text-2xl font-semibold mb-4'>Goals for {selectedExercise?.name}</Text>
          <GoalBoard goals={associatedGoals} />
          <PerformanceChart performanceData={performanceData} />
        </View>
      </ScrollView>
    </View>
  );
};

export default TrackExercisePage;