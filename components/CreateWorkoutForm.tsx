import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import { storage } from '@/storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import useWorkoutBuilderStore from '@/hooks/useWorkoutBuilderStore';

const CreateWorkoutForm = () => {
  const [title, setTitle] = useState('');
  const isFocused = useIsFocused();
  const selectedExercises = useWorkoutBuilderStore(state => state.exercises);

  useEffect(() => {
    if (isFocused)
      console.log('Selected exercises:', selectedExercises);
  }, [isFocused])

  const goToExerciseSelection = () => {
    router.push('/(exercises)/SelectExercisePage');
  };

  const handleSaveWorkout = () => {
    const newWorkoutId = uuid.v4();
    const newWorkout: WorkoutDefinition = { id: newWorkoutId, title, exerciseIds: selectedExercises.map(e => e.id) };

    const existingWorkouts = storage.getString('data_workouts');
    const workouts: WorkoutDefinition[] = existingWorkouts ? JSON.parse(existingWorkouts) : [];
    
    workouts.push(newWorkout);
    storage.set('data_workouts', JSON.stringify(workouts));
    console.log('Workout saved:', newWorkout);

    router.back();
  };

  return (
    <View className="p-4 bg-slate-900 flex-1">
      <Text className="text-white text-2xl mb-4">Create New Workout</Text>
      <TextInput
        className="bg-gray-800 text-white p-2 mb-4 rounded"
        placeholder="Workout Title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />
      <TouchableOpacity
        className="bg-blue-500 py-12 px-4 rounded-lg mb-4"
        onPress={goToExerciseSelection}
      >
        <Text className="text-white text-center font-semibold">Add Exercise</Text>
      </TouchableOpacity>
      {selectedExercises.length > 0 && (
        <View className="mb-4">
          <Text className="text-white text-xl mb-2">Exercises:</Text>
          {selectedExercises.map((exercise, index) => (
            <Text key={index} className="text-gray-300">{exercise.name}</Text>
          ))}
        </View>
      )}
      <TouchableOpacity
        className="bg-green-500 py-3 px-4 rounded-lg"
        onPress={handleSaveWorkout}
      >
        <Text className="text-white text-center font-semibold">Save Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateWorkoutForm;