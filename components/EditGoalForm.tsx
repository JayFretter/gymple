import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { storage } from '@/storage';
import uuid from 'react-native-uuid';
import GoalDefinition from '@/interfaces/GoalDefinition';
import { router } from 'expo-router';
import useGoalBuilderStore from '@/hooks/useGoalBuilderStore';
import { useIsFocused } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import WheelPicker from './WheelPicker';
import useCalculateGoalPerformance from '@/hooks/useCalculateGoalPerformance';
import useUpsertGoal from '@/hooks/useUpsertGoal';

export type EditGoalFormProps = {
  goalId: string | null;
};

export default function EditGoalForm(props: EditGoalFormProps) {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const isFocused = useIsFocused();

  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);
  const [isRepsModalVisible, setIsRepsModalVisible] = useState(false);

  const selectedExercise = useGoalBuilderStore(state => state.exercise);
  const removeGoalBuilderExercise = useGoalBuilderStore(state => state.removeExercise);

  const calculateGoalPerformance = useCalculateGoalPerformance();
  const upsertGoal = useUpsertGoal();

  const [selectedExerciseName, setSelectedExerciseName] = useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  const isNewGoal: boolean = !props.goalId;

  useEffect(() => {
    if (isFocused) {
      if (!isNewGoal && !selectedExercise) {
        fetchGoal();
      }
      else if (selectedExercise) {
        setSelectedExerciseName(selectedExercise.name);
        setSelectedExerciseId(selectedExercise.id);
        removeGoalBuilderExercise();
      }
    }
  }, [isFocused]);

  const fetchGoal = () => {
    if (!props.goalId) {
      return;
    }

    const storedGoalsString = storage.getString('data_goals');
    const storedGoals: GoalDefinition[] = storedGoalsString ? JSON.parse(storedGoalsString) : [];
    const goalToEdit = storedGoals.find(goal => goal.id === props.goalId);

    setSelectedExerciseName(goalToEdit?.associatedExerciseName || null);
    setSelectedExerciseId(goalToEdit?.associatedExerciseId || null);
    setWeight(goalToEdit?.weight.toString() || '');
    setReps(goalToEdit?.reps.toString() || '');
  }

  const handleWeightSelected = (value: string) => {
    setWeight(value);
    setIsWeightModalVisible(false);
  }

  const openWeightModal = () => {
    setIsWeightModalVisible(true)
  }

  const handleRepsSelected = (value: string) => {
    setReps(value);
    setIsRepsModalVisible(false);
  }

  const openRepsModal = () => {
    setIsRepsModalVisible(true)
  }

  const saveGoal = () => {
    const newGoal: GoalDefinition = {
      id: props.goalId || uuid.v4(),
      associatedExerciseName: selectedExerciseName!,
      associatedExerciseId: selectedExerciseId!,
      reps: parseInt(reps),
      weight: parseFloat(weight),
      percentage: 0
    };

    const perc = getPercentageOfGoalCompleted(newGoal);
    console.log('Calculated goal percentage:', perc)

    newGoal.percentage = perc;

    upsertGoal(newGoal);
    
    router.back();
  };

  const getPercentageOfGoalCompleted = (goal: GoalDefinition) => {
    return calculateGoalPerformance(goal);
  }

  const goToExerciseSelection = () => {
    router.push('/(exercises)/SelectExercisePage');
  };

  return (
    <View className="p-2 bg-gray-200 flex-1 items-center">
      {isNewGoal ?
        <Text className="text-black text-2xl font-bold mb-4 self-start">Create a new goal</Text> :
        <Text className="text-black text-2xl font-bold mb-4 self-start">Edit goal</Text>
      }
      <TouchableOpacity
        className="bg-gray-100 py-3 px-4 rounded-lg mb-4 w-full"
        onPress={goToExerciseSelection}
      >
        {selectedExerciseName ?
          <Text className="text-gray-800 text-center font-semibold">{selectedExerciseName}</Text> :
          <Text className="text-gray-800 text-center font-semibold">Select Exercise</Text>}
      </TouchableOpacity>
      <View className="flex-row justify-between items-center mb-4 gap-4">
        <View className='flex-row gap-1 items-center justify-center bg-gray-300 rounded-xl p-2'>
          <TextInput className='text-gray-800 font-semibold text-lg' keyboardType='numeric' placeholder='0' value={weight} onChangeText={setWeight} />
          <Text className='text-gray-600'>kg</Text>
        </View>
        <FontAwesome name="times" size={16} color="#9ca3af" />
        <View className='flex-row gap-1 items-center justify-center bg-gray-300 rounded-xl p-2'>
          <TextInput className='text-gray-800 font-semibold text-lg' keyboardType='numeric' placeholder='0' value={reps} onChangeText={setReps} />
          <Text className='text-gray-600'>reps</Text>
        </View>
      </View>
      <TouchableOpacity
        className="bg-green-500 py-3 px-4 rounded-lg w-full"
        onPress={saveGoal}
      >
        <Text className="text-white text-center font-semibold">Save Goal</Text>
      </TouchableOpacity>
    </View>
  );
};