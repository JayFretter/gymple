import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import uuid from 'react-native-uuid';
import useStorage from '@/hooks/useStorage';

const CreateExerciseForm = () => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');
  const { fetchFromStorage, setInStorage } = useStorage();

  const saveExercise = () => {
    const newExercise: ExerciseDefinition = { id: uuid.v4(), name, notes, category };

    var exercises = fetchFromStorage<ExerciseDefinition[]>('data_exercises') ?? [];
    
    exercises.push(newExercise);
    exercises = exercises.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

    setInStorage('data_exercises', exercises);
    console.log('Exercise saved:', newExercise);
  };

  return (
    <View className="p-4 bg-primary flex-1">
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
      {/* TODO: make this a dropdown */}
      <TextInput
        className="bg-gray-800 text-white p-2 mb-4 rounded"
        placeholder="Category"
        placeholderTextColor="#888"
        value={category}
        onChangeText={setCategory}
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