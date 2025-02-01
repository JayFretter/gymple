import { storage } from '@/storage';
import { useEffect } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from 'react-native';

export default function WorkoutsPage() {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused)
      fetchWorkouts();
  }, [isFocused])

  const saveWorkout = () => {
    const dummyWorkout = {title: 'Push Day', exercises: ['Bench Press', 'Overhead Press', 'Tricep Extension']};
    storage.set('data_workouts', JSON.stringify([dummyWorkout]));
    console.log('Workout saved:', dummyWorkout);
  }

  const fetchWorkouts = () => {
    const workouts = storage.getString('data_workouts');
    if (workouts) {
      console.log('Workouts:', workouts);
    }
  }

  return (
      <View className='flex-1 justify-center items-center gap-12'>
        <Text className='text-gray-300'>Your workouts:</Text>
        <TouchableOpacity
          className="bg-green-500 py-3 px-4 rounded-lg"
          onPress={saveWorkout}
        >
          <Text className="text-white text-center font-semibold">Create a new workout!</Text>
        </TouchableOpacity>
      </View>
  );
}