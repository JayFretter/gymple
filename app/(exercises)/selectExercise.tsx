import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { storage } from '@/storage';

export default function SelectExercise() {
  const isFocused = useIsFocused();
  const [exercises, setExercises] = useState<ExerciseDefinition[]>([]);

  useEffect(() => {
    if (isFocused)
      fetchExercises();
  }, [isFocused])

  const fetchExercises = () => {
    console.log('Fetching exercises 2');
    const storedExercisesString = storage.getString('data_exercises');
    const storedExercises: ExerciseDefinition[] = storedExercisesString ? JSON.parse(storedExercisesString) : [];

    setExercises(storedExercises);
  }

  return (
    <ScrollView className='bg-slate-900'>
      <View className='flex-1 justify-center items-center mt-20'>
        <Text className='text-gray-200 text-xl mb-8'>Please select your exercise:</Text>
        <View className='flex w-full items-center gap-4'>
          {exercises.map((exercise, index) =>
            <TouchableOpacity key={index} className='bg-slate-700 w-[95%] py-4 flex items-center justify-center'>
              <Text className='text-3xl text-green-300 mb-2'>{exercise.name}</Text>
              <Text className='text-gray-300'>{exercise.notes}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
