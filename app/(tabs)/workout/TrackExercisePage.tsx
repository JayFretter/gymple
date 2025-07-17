import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import { Provider } from 'react-native-paper';
import theme from '../../theme';
import { router, useLocalSearchParams } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { storage } from '@/storage';
import ExercisePerformanceData from '@/interfaces/ExercisePerformanceData';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import WorkoutTimer from '@/components/WorkoutTimer';
import PerformanceChart from '@/components/PerformanceChart';
import useFetchAssociatedGoalsForExercise from '@/hooks/useFetchAssociatedGoalsForExercise';
import GoalDefinition from '@/interfaces/GoalDefinition';
import GoalBoard from '@/components/GoalBoard';
import useCalculateGoalPerformance from '@/hooks/useCalculateGoalPerformance';
import useUpsertGoal from '@/hooks/useUpsertGoal';
import { WeightAndRepsPicker } from '@/components/WeightAndRepsPicker';
import useUserPreferences from '@/hooks/useUserPreferences';
import UserPreferences from '@/interfaces/UserPreferences';
import AntDesign from '@expo/vector-icons/AntDesign';

const TrackExercisePage = () => {
  const [performanceData, setPerformanceData] = useState<ExercisePerformanceData[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDefinition | null>(null);
  const [sets, setSets] = useState([{ reps: 0, weight: 0, weightUnit: 'kg' }]);
  const [sessionNotes, setSessionNotes] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();

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
    <Provider theme={theme}>
      <ScrollView className="flex-1 pt-8 px-4 bg-gray-200" showsVerticalScrollIndicator={false}>
        <Text className='text-gray-800 text-4xl font-bold'>{selectedExercise?.name}</Text>
        <View className='flex-row justify-end mb-4'>
          <TouchableOpacity
            className="bg-[#03a1fc] py-2 px-4 rounded-xl"
            onPress={saveWorkout}
          >
            <Text className="text-white text-center font-semibold">Finish tracking</Text>
          </TouchableOpacity>
        </View>
        <View className="mb-8 py-4 bg-white rounded-xl">
          {sets.map((set, index) => (
            <View key={index} className="flex-row justify-between items-center mb-2 border-b-2 border-gray-200 pb-2 mx-4">
              <Text className="text-center text-gray-800 font-bold text-xl">Set {index + 1}</Text>
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
              <AntDesign name="swap" size={14} color="black" />
              <Text className="text-gray-600 text-center">kg/lbs</Text>
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
          className="bg-white text-black px-2 py-4 rounded-xl mb-12"
          placeholder="Notes (optional)"
          placeholderTextColor="#888"
          value={sessionNotes ?? ''}
          onChangeText={setSessionNotes}
        />
        <Text className='text-2xl font-semibold mb-4 text-center'>Rest timer</Text>
        <WorkoutTimer startSeconds={90} />
        <View className='mt-24 flex items-center'>
          <Text className='text-2xl font-semibold'>Goals for {selectedExercise?.name}</Text>
          <GoalBoard goals={associatedGoals} />
          <PerformanceChart performanceData={performanceData} initialWeightUnit={userPreferences?.weightUnit ?? 'kg'}/>
          {/* <DashboardTile mainText='23%' subText='Up from last session' /> */}
        </View>
      </ScrollView>
    </Provider>
  );
};

export default TrackExercisePage;