import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { storage } from '@/storage';
import uuid from 'react-native-uuid';
import GoalDefinition from '@/interfaces/GoalDefinition';
import { router } from 'expo-router';
import useGoalBuilderStore from '@/hooks/useGoalBuilderStore';
import { useIsFocused } from '@react-navigation/native';

export type EditGoalFormProps = {
  goalId: string | null;
};

export default function EditGoalForm(props: EditGoalFormProps) {
  const [associatedExercise, setAssociatedExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const isFocused = useIsFocused();

  const selectedExercise = useGoalBuilderStore(state => state.exercise);
  const removeGoalBuilderExercise = useGoalBuilderStore(state => state.removeExercise);

  const [selectedExerciseName, setSelectedExerciseName] = useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  useEffect(() => {
    if (isFocused) {
      if (props.goalId && !selectedExercise) {
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
      // initialiseNewGoal();
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

  const saveGoal = () => {
    const goalTitle = `${selectedExerciseName} - ${weight}kg x ${reps} reps`;

    const newGoal: GoalDefinition = {
      id: uuid.v4(),
      associatedExerciseName: selectedExerciseName!,
      associatedExerciseId: selectedExerciseId!,
      reps: parseInt(reps),
      weight: parseInt(weight),
      percentage: 0
    };

    const existingGoals = storage.getString('data_goals');
    var goals: GoalDefinition[] = existingGoals ? JSON.parse(existingGoals) : [];

    goals.push(newGoal);

    storage.set('data_goals', JSON.stringify(goals));
    console.log('Goal saved:', newGoal);
  };

  const goToExerciseSelection = () => {
    router.push('/(exercises)/SelectExercisePage');
  };

  return (
    <View className="p-2 bg-gray-200 flex-1">
      <Text className="text-black text-2xl font-bold mb-4">Create a new goal</Text>
      <TouchableOpacity
        className="bg-gray-700 py-3 px-4 rounded-lg mb-4"
        onPress={goToExerciseSelection}
      >
        {selectedExerciseName ?
          <Text className="text-white text-center font-semibold">{selectedExerciseName}</Text> :
          <Text className="text-white text-center font-semibold">Select Exercise</Text>}
      </TouchableOpacity>
      <View className='flex-row w-1/2 items-center justify-between gap-4 mb-4'>
        <Text className="text-black text-center font-semibold">Weight (kg):</Text>
        <TextInput
          className="bg-gray-400 text-white p-2 rounded"
          placeholder="0"
          placeholderTextColor="#FFF"
          keyboardType='number-pad'
          value={weight}
          onChangeText={setWeight}
        />
      </View>
      <View className='flex-row w-1/2 items-center justify-between gap-4 mb-4'>
        <Text className="text-black text-center font-semibold">Reps:</Text>
        <TextInput
          className="bg-gray-400 text-white p-2 rounded"
          placeholder="Reps"
          placeholderTextColor="#FFF"
          keyboardType='number-pad'
          value={reps}
          onChangeText={setReps}
        />
      </View>
      <TouchableOpacity
        className="bg-green-500 py-3 px-4 rounded-lg"
        onPress={saveGoal}
      >
        <Text className="text-white text-center font-semibold">Save Goal</Text>
      </TouchableOpacity>
    </View>
  );
};