import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { storage } from '@/storage';

const CreateExerciseForm = () => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const saveExercise = () => {
    const newExercise: ExerciseDefinition = { name, notes };
    const existingExercises = storage.getString('data_exercises');
    const exercises: ExerciseDefinition[] = existingExercises ? JSON.parse(existingExercises) : [];
    exercises.push(newExercise);
    storage.set('data_exercises', JSON.stringify(exercises));
    console.log('Exercise saved:', newExercise);
  };

  return (
    <View className="p-4 bg-slate-900 flex-1">
      <Text className="text-white text-2xl mb-4">Create New Exercise</Text>
      <TextInput
        className="bg-gray-800 text-white p-2 mb-4 rounded"
        placeholder="Exercise Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="bg-gray-800 text-white p-2 mb-4 rounded"
        placeholder="Notes"
        placeholderTextColor="#888"
        value={notes}
        onChangeText={setNotes}
      />
      <TouchableOpacity
        className="bg-green-500 py-3 px-4 rounded-lg"
        onPress={saveExercise}
      >
        <Text className="text-white text-center font-semibold">Save Exercise</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateExerciseForm;