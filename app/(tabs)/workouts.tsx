import { storage } from '@/storage';
import { useEffect, useState } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import { WorkoutTile } from '@/components/WorkoutTile';
import { router } from 'expo-router';

export default function WorkoutsPage() {
  const isFocused = useIsFocused();
  const [workouts, setWorkouts] = useState<WorkoutDefinition[]>([]);

  useEffect(() => {
    if (isFocused)
      fetchWorkouts();
  }, [isFocused])

  const fetchWorkouts = () => {
    const workouts = storage.getString('data_workouts');
    if (workouts) {
      setWorkouts(JSON.parse(workouts));
    }
  }

  return (
    <ScrollView className='bg-slate-900 flex-1'>
      <View className='flex items-center justify-center mt-20 gap-8'>
        <TouchableOpacity
          className="bg-green-500 py-3 px-4 rounded-lg"
          onPress={() => router.push('/(workouts)/CreateWorkoutPage')}
        >
          <Text className="text-white text-center font-semibold">Create a new workout!</Text>
        </TouchableOpacity>
        <Text className='text-gray-300'>Your workouts:</Text>
        {workouts.map((workout, index) =>
          <WorkoutTile key={index} workoutDefinition={workout} />
        )}
      </View>
    </ScrollView>
  );
}