import GoalBoard from '@/components/GoalBoard';
import PerformanceChart from '@/components/PerformanceChart';
import RestTimer from '@/components/RestTimer';
import GradientPressable from '@/components/shared/GradientPressable';
import PopUp from '@/components/shared/PopUp';
import RecordCard from '@/components/shared/RecordCard';
import SetsList from '@/components/shared/SetsList';
import { WeightAndRepsPickerLarge } from '@/components/shared/WeightAndRepsPickerLarge';
import useCalculateGoalPerformance from '@/hooks/useCalculateGoalPerformance';
import useCalculateVolume from '@/hooks/useCalculateVolume';
import useCurrentWorkoutStore from '@/hooks/useCurrentWorkoutStore';
import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import useFetchAssociatedGoalsForExercise from '@/hooks/useFetchAssociatedGoalsForExercise';
import useStorage from '@/hooks/useStorage';
import useUpdateCurrentWorkoutAchievements from '@/hooks/useUpdateCurrentWorkoutAchievements';
import useUpdateExerciseMaxes from '@/hooks/useUpdateExerciseMaxes';
import useUpsertGoal from '@/hooks/useUpsertGoal';
import useUserPreferences from '@/hooks/useUserPreferences';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import ExercisePerformanceData from '@/interfaces/ExercisePerformanceData';
import GoalDefinition from '@/interfaces/GoalDefinition';
import UserPreferences from '@/interfaces/UserPreferences';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

const TrackExercisePage = () => {
  const [performanceData, setPerformanceData] = useState<ExercisePerformanceData[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDefinition | null>(null);
  const [sets, setSets] = useState([{ reps: 0, weight: 0, weightUnit: 'kg' }]);
  const [sessionNotes, setSessionNotes] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();
  const { fetchFromStorage, setInStorage } = useStorage();

  const [popUpVisible, setPopUpVisible] = useState(false);
  const [selectedSetIndex, setSelectedSetIndex] = useState<number>(0);

  const currentWorkout = useCurrentWorkoutStore(state => state.currentWorkout);
  const addPerformanceToCurrentWorkout = useCurrentWorkoutStore(state => state.addPerformanceData);
  const addCompletedGoalToCurrentWorkout = useCurrentWorkoutStore(state => state.addCompletedGoal);
  const currentWorkoutPerformanceData = useCurrentWorkoutStore(state => state.performanceData);

  const updateExerciseMaxes = useUpdateExerciseMaxes();
  const updateCurrentWorkoutAchievements = useUpdateCurrentWorkoutAchievements();

  const [associatedGoals, setAssociatedGoals] = useState<GoalDefinition[]>([]);
  const fetchAssociatedGoalsForExercise = useFetchAssociatedGoalsForExercise();

  const calculateGoalPerformance = useCalculateGoalPerformance();
  const upsertGoal = useUpsertGoal();

  const [getUserPreferences] = useUserPreferences();
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [restTimerDurationSeconds, setRestTimerDurationSeconds] = useState(90);

  const calculateVolume = useCalculateVolume();

  useEffect(() => {
    if (isFocused) {
      const exerciseId = params.exerciseId as string;
      getExerciseDefinition(exerciseId);
      getExerciseData(exerciseId);

      const goals = fetchAssociatedGoalsForExercise(exerciseId);
      console.log('Associated goals:', goals);
      setAssociatedGoals(goals);

      const userPreferences = getUserPreferences();
      setUserPreferences(userPreferences);
      setWeightUnit(userPreferences.weightUnit);
      setRestTimerDurationSeconds(userPreferences.defaultRestTimerDurationSeconds);

      const exerciseDataInWorkout = currentWorkoutPerformanceData.find((data) => data.exerciseId === exerciseId);

      if (exerciseDataInWorkout) {
        setSets(exerciseDataInWorkout.sets);
        setSessionNotes(exerciseDataInWorkout.notes);
      } else {
        setSets([{ reps: 0, weight: 0, weightUnit: userPreferences.weightUnit }]); // HERE
        setSelectedSetIndex(0);
        setSessionNotes(null);
      }
    }
  }, [isFocused, currentWorkout]);

  const switchWeightUnit = () => {
    const newUnit = weightUnit === 'kg' ? 'lbs' : 'kg';
    setWeightUnit(newUnit);
    setWeightUnitForAllSets(newUnit);
  }

  const setWeightUnitForAllSets = (unit: 'kg' | 'lbs') => {
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
      return;

    setSelectedExercise(exercise);
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
      exerciseId: selectedExercise.id,
      sets: sets,
      date: new Date().getTime(),
      notes: sessionNotes
    };

    addPerformanceToCurrentWorkout(workoutData);
    // updateCurrentWorkoutAchievements(workoutData);

    associatedGoals.forEach(goal => {
      const newGoalPercentage = calculateGoalPerformance(goal);

      if (newGoalPercentage >= 100 && goal.percentage < 100) {
        addCompletedGoalToCurrentWorkout(goal);
      }

      if (!currentWorkout) {
        goal.percentage = newGoalPercentage;
        upsertGoal(goal);
      }
    });

    if (!currentWorkout) {
      updateExerciseMaxes(selectedExercise.id, workoutData);

      const existingData = fetchFromStorage<ExercisePerformanceData[]>(`data_exercise_${selectedExercise.id}`) ?? [];
      existingData.push(workoutData);
      setInStorage(`data_exercise_${selectedExercise.id}`, existingData);
      console.log('Saved data:', workoutData);
    }

    router.back();
  };

  const clearData = () => {
    setSets([{ reps: 0, weight: 0, weightUnit: 'kg' }]);
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
    setPopUpVisible(true);
  }

  const renderVolumeRecordText = () => {
    const oldVolume = selectedExercise?.maxVolumeInKg ?? 0;
    const newVolume = calculateVolume(sets, 'kg');
    if (newVolume > oldVolume) {
      return (
        <RecordCard title='New volume record!' oldValue={oldVolume} newValue={newVolume} />
      );
    }
  }

  return (
    <View className='flex-1'>

      <PopUp visible={popUpVisible} onClose={() => setPopUpVisible(false)} closeButtonText='Done' >
        <View className="flex-row justify-between items-center mx-4 mb-4">
          <Text className="text-center text-txt-primary font-bold text-xl">Set {selectedSetIndex + 1}</Text>
          {(sets[selectedSetIndex]) &&
            <WeightAndRepsPickerLarge
              onWeightSelected={(value) => handleWeightSelected(value, selectedSetIndex)}
              onRepsSelected={(value) => handleRepsSelected(value, selectedSetIndex)}
              weightUnit={weightUnit}
              placeholderWeight={sets[selectedSetIndex].weight}
              placeholderReps={sets[selectedSetIndex].reps}
              onFormComplete={() => setPopUpVisible(false)}
            />
          }
        </View>
      </PopUp>

      <View className='flex-row w-full items-center justify-center absolute bottom-4 z-10'>
        <GradientPressable
          className='w-3/4'
          style='default'
          onPress={saveWorkout}
        >
          <Text className="text-white text-lg text-center my-2">Exercise Finished</Text>
        </GradientPressable>
      </View>
      <ScrollView className="flex-1 px-4 bg-primary" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className='text-txt-primary text-4xl font-bold mb-4 mt-4'>{selectedExercise?.name}</Text>
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
        {renderVolumeRecordText()}
        <TextInput
          className="bg-card text-txt-primary px-2 py-4 rounded-xl mb-12"
          placeholder="Notes about this session..."
          placeholderTextColor="#888"
          value={sessionNotes ?? ''}
          onChangeText={setSessionNotes}
        />
        <Text className='text-txt-primary text-2xl font-semibold mb-4 text-center'>Rest timer</Text>
        <RestTimer startSeconds={restTimerDurationSeconds} />
        <View className='mt-24 flex items-center'>
          <Text className='text-txt-primary text-2xl font-semibold'>Goals for {selectedExercise?.name}</Text>
          <GoalBoard goals={associatedGoals} />
          <PerformanceChart performanceData={performanceData} initialWeightUnit={userPreferences?.weightUnit ?? 'kg'} />
          {/* <DashboardTile mainText='23%' subText='Up from last session' /> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default TrackExercisePage;