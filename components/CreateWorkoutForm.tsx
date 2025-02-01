import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import { storage } from '@/storage';

const CreateWorkoutForm = () => {
  const [title, setTitle] = useState('');
  const [exercises, setExercises] = useState<string[]>([]);
  const [exerciseInput, setExerciseInput] = useState('');

  const addExercise = () => {
    if (exerciseInput.trim()) {
      setExercises([...exercises, exerciseInput.trim()]);
      setExerciseInput('');
    }
  };

  const saveWorkout = () => {
    const newWorkout: WorkoutDefinition = { title, exercises };
    const existingWorkouts = storage.getString('data_workouts');
    const workouts: WorkoutDefinition[] = existingWorkouts ? JSON.parse(existingWorkouts) : [];
    workouts.push(newWorkout);
    storage.set('data_workouts', JSON.stringify(workouts));
    console.log('Workout saved:', newWorkout);
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
      <TextInput
        className="bg-gray-800 text-white p-2 mb-4 rounded"
        placeholder="Add Exercise"
        placeholderTextColor="#888"
        value={exerciseInput}
        onChangeText={setExerciseInput}
        onSubmitEditing={addExercise}
      />
      <TouchableOpacity
        className="bg-blue-500 py-2 px-4 rounded-lg mb-4"
        onPress={addExercise}
      >
        <Text className="text-white text-center font-semibold">Add Exercise</Text>
      </TouchableOpacity>
      {exercises.length > 0 && (
        <View className="mb-4">
          <Text className="text-white text-xl mb-2">Exercises:</Text>
          {exercises.map((exercise, index) => (
            <Text key={index} className="text-gray-300">{exercise}</Text>
          ))}
        </View>
      )}
      <TouchableOpacity
        className="bg-green-500 py-3 px-4 rounded-lg"
        onPress={saveWorkout}
      >
        <Text className="text-white text-center font-semibold">Save Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateWorkoutForm;