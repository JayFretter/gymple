import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import uuid from 'react-native-uuid';
import useStorage from '@/hooks/useStorage';
import { router } from 'expo-router';
import PopUp from './shared/PopUp';
import { ExerciseCategory } from '@/enums/exercise-category';
import AntDesign from '@expo/vector-icons/AntDesign';
import GradientPressable from './shared/GradientPressable';

const EXERCISE_CATEGORIES = Object.values(ExerciseCategory);

const CreateExerciseForm = () => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [categories, setCategories] = useState<ExerciseCategory[]>([ExerciseCategory.Miscellaneous]);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const { fetchFromStorage, setInStorage } = useStorage();

  const saveExercise = () => {
    const newExercise: ExerciseDefinition = { id: uuid.v4(), name, notes, categories, experience: { level: 0, percentage: 0 } };

    var exercises = fetchFromStorage<ExerciseDefinition[]>('data_exercises') ?? [];

    exercises.push(newExercise);
    exercises = exercises.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

    setInStorage('data_exercises', exercises);
    router.back();
  };

  const popUpClosed = () => {
    setPopUpVisible(false);
  }

  const handleCategoriesButtonPressed = () => {
    setPopUpVisible(true);
  }

  const handleCategorySelected = (category: ExerciseCategory) => {
    if (category === ExerciseCategory.Miscellaneous) {
      setCategories([ExerciseCategory.Miscellaneous]);
      return;
    }

    let newCategories = [...categories];

    if (newCategories.includes(category)) {
      newCategories = newCategories.filter(c => c !== category);
    } else {
      newCategories = [...newCategories, category];
    }

    if (newCategories.length === 0) {
      setCategories([ExerciseCategory.Miscellaneous]);
      return;
    } else if (newCategories.length >= 2 && newCategories.includes(ExerciseCategory.Miscellaneous)) {
      newCategories = newCategories.filter(c => c !== ExerciseCategory.Miscellaneous);
    }

    setCategories(newCategories);
  
    
  }

  return (
    <View className="px-4 mt-4 bg-primary flex-1">
      <PopUp visible={popUpVisible} onClose={popUpClosed}>
        <View>
          <Text className='text-txt-primary text-2xl font-bold mb-4'>Select Categories</Text>
          <View className='flex flex-wrap max-h-[30vh] gap-2'>
            {EXERCISE_CATEGORIES.map((category, index) => {
              return (
                categories.includes(category) ? 
                <TouchableOpacity key={index} className='bg-green-600 flex-row items-center gap-2 rounded-xl px-4 py-2' onPress={() => handleCategorySelected(category)}>
                  <Text className='text-txt-primary text-xl'>{category}</Text>
                  <AntDesign name="check" size={12} color="white" />
                </TouchableOpacity>
                :
                <TouchableOpacity key={index} className='bg-card flex-row items-center gap-2 rounded-xl px-4 py-2' onPress={() => handleCategorySelected(category)}>
                  <Text className='text-txt-primary text-xl'>{category}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </PopUp>
      <Text className="text-txt-primary text-3xl font-bold mb-8">Create a new exercise</Text>
      <TextInput
        className="bg-card text-txt-primary text-xl p-2 mb-4 rounded"
        placeholder="Exercise Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="bg-card text-txt-primary text-xl p-2 mb-4 rounded"
        placeholder="Notes (setup, tips, etc.)"
        placeholderTextColor="#888"
        value={notes}
        onChangeText={setNotes}
      />
      {/* TODO: make this a dropdown */}
      <TouchableOpacity className="bg-card p-2 mb-4 rounded" onPress={handleCategoriesButtonPressed}>
        <Text className="text-txt-secondary text-xl">Categories: {categories.join(', ')}</Text>
      </TouchableOpacity>
      <GradientPressable
        style='green'
        onPress={saveExercise}
      >
        <Text className="text-white text-center font-semibold my-3 mx-4">Save Exercise</Text>
      </GradientPressable>
    </View>
  );
};

export default CreateExerciseForm;