import GoalBoard from '@/components/GoalBoard';
import PerformanceChart from '@/components/PerformanceChart';
import RestTimer from '@/components/RestTimer';
import GradientPressable from '@/components/shared/GradientPressable';
import WorkoutTimer from '@/components/shared/WorkoutTimer';
import { WeightAndRepsPicker } from '@/components/WeightAndRepsPicker';
import useCalculateGoalPerformance from '@/hooks/useCalculateGoalPerformance';
import useCurrentWorkoutStore from '@/hooks/useCurrentWorkoutStore';
import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import useFetchAssociatedGoalsForExercise from '@/hooks/useFetchAssociatedGoalsForExercise';
import useUpdateCurrentWorkoutAchievements from '@/hooks/useUpdateCurrentWorkoutAchievements';
import useUpdateExerciseMaxes from '@/hooks/useUpdateExerciseMaxes';
import useUpsertGoal from '@/hooks/useUpsertGoal';
import useUserPreferences from '@/hooks/useUserPreferences';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import ExercisePerformanceData from '@/interfaces/ExercisePerformanceData';
import GoalDefinition from '@/interfaces/GoalDefinition';
import UserPreferences from '@/interfaces/UserPreferences';
import { storage } from '@/storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const TrackExercisePage = () => {
  const [performanceData, setPerformanceData] = useState<ExercisePerformanceData[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDefinition | null>(null);
  const [sets, setSets] = useState([{ reps: 0, weight: 0, weightUnit: 'kg' }]);
  const [sessionNotes, setSessionNotes] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();

  const currentWorkout = useCurrentWorkoutStore(state => state.currentWorkout);

  const updateExerciseMaxes = useUpdateExerciseMaxes();
  const updateCurrentWorkoutAchievements = useUpdateCurrentWorkoutAchievements();

  const [associatedGoals, setAssociatedGoals] = useState<GoalDefinition[]>([]);
  const fetchAssociatedGoalsForExercise = useFetchAssociatedGoalsForExercise();

  const calculateGoalPerformance = useCalculateGoalPerformance();
  const upsertGoal = useUpsertGoal();

  const [getUserPreferences] = useUserPreferences();
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');

  useEffect(() => {
    if (isFocused) {
      getExerciseDefinition(params.exerciseId as string);
      getExerciseData(params.exerciseId as string);

      const goals = fetchAssociatedGoalsForExercise(params.exerciseId as string);
      console.log('Associated goals:', goals);
      setAssociatedGoals(goals);

      const userPreferences = getUserPreferences();
      setUserPreferences(userPreferences);
      setWeightUnit(userPreferences.weightUnit);
      setWeightUnitForAllSets(userPreferences.weightUnit);
    }
  }, [isFocused]);

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

  const saveWorkout = () => {
    if (!selectedExercise)
      return;

    const workoutData: ExercisePerformanceData = {
      exerciseId: selectedExercise.id,
      sets: sets,
      date: new Date().getTime(),
      notes: sessionNotes
    };

    updateCurrentWorkoutAchievements(workoutData);
    updateExerciseMaxes(selectedExercise.id, workoutData);

    const existingDataString = storage.getString(`data_exercise_${selectedExercise.id}`);
    var existingData: ExercisePerformanceData[] = existingDataString ? JSON.parse(existingDataString) : [];
    existingData.push(workoutData);

    storage.set(`data_exercise_${selectedExercise.id}`, JSON.stringify(existingData));
    console.log('Saved data:', workoutData);

    associatedGoals.forEach(goal => {
      const goalPerformance = calculateGoalPerformance(goal);
      goal.percentage = goalPerformance;
      upsertGoal(goal);
    });

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
    const dataString = storage.getString(`data_exercise_${exerciseId}`);
    const historicData: ExercisePerformanceData[] = dataString ? JSON.parse(dataString) : [];
    console.log('Historic data:', historicData);

    setPerformanceData(historicData);
  }

  return (
    <View className='flex-1'>
      <View className='flex-row w-full items-center justify-center absolute bottom-4 z-10'>
        <GradientPressable
          className='w-3/4'
          style='default'
          onPress={saveWorkout}
        >
          <Text className="text-white text-lg text-center">Exercise Finished</Text>
        </GradientPressable>
      </View>
      <ScrollView className="flex-1 px-4 bg-primary" showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 32}}>
        {currentWorkout &&
          <WorkoutTimer className='mb-2' />
        }
        <Text className='text-txt-primary text-4xl font-bold mb-4'>{selectedExercise?.name}</Text>

        <View className="mb-8 py-4 bg-card rounded-xl">
          {sets.map((set, index) => (
            <View key={index} className="flex-row justify-between items-center mb-2 border-b-2 border-txt-secondary pb-2 mx-4">
              <Text className="text-center text-txt-primary font-bold text-xl">Set {index + 1}</Text>
              <WeightAndRepsPicker
                onWeightSelected={(value) => handleWeightSelected(value, index)}
                onRepsSelected={(value) => handleRepsSelected(value, index)}
                weightUnit={weightUnit}
                initialWeight={index > 0 ? set.weight : undefined}
                initialReps={index > 0 ? set.reps : undefined}
              />
            </View>
          ))}
          <View className='flex flex-row justify-between mt-4 mx-8 gap-12'>
            <TouchableOpacity
              className="flex-1"
              onPress={clearData}
            >
              <Text className="text-red-400 text-left font-semibold">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-2 flex-row items-center justify-center"
              onPress={() => switchWeightUnit()}
            >
              <AntDesign name="swap" size={14} color="white" />
              <Text className="text-txt-secondary text-center">kg/lbs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1"
              onPress={addSet}
            >
              <Text className="text-blue-500 text-right font-semibold">+ Add Set</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TextInput
          className="bg-card text-txt-primary px-2 py-4 rounded-xl mb-12"
          placeholder="Notes (optional)"
          placeholderTextColor="#888"
          value={sessionNotes ?? ''}
          onChangeText={setSessionNotes}
        />
        <Text className='text-txt-primary text-2xl font-semibold mb-4 text-center'>Rest timer</Text>
        <RestTimer startSeconds={90} />
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