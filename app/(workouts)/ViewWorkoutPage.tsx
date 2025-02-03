import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import { storage } from '@/storage';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

export default function ViewWorkoutPage() {
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();
  const [workout, setWorkout] = useState<WorkoutDefinition | null>(null);

  useEffect(() => {
    if (isFocused) {
      fetchWorkout(params.workoutId as string);
    }
  }, [isFocused]);

  const fetchWorkout = (id: string) => {
    const workouts = storage.getString('data_workouts');
    if (workouts) {
      const allWorkouts = JSON.parse(workouts) as WorkoutDefinition[];
      const currentWorkout = allWorkouts.find(w => w.id === id);
      setWorkout(currentWorkout || null);
    }
  }

  return (
    <View className="flex-1 bg-gray-900 px-4 pt-12">
      {workout ? (
        <View>
          <Text className="text-white text-4xl font-bold mb-8">{workout.title}</Text>
          {workout.exercises.map((exercise, index) => (
            <TouchableOpacity
              key={index}
              className="bg-gray-700 p-4 rounded-lg mb-3"
              onPress={() => router.push({pathname: '/(exercises)/TrackExercisePage', params: {exerciseId: exercise}})}
            >
              <Text className="text-gray-200 text-xl mb-2">{exercise}</Text>
              <View className='flex flex-row items-center gap-2'>
                <View className='w-1 h-1 bg-green-500 rounded-full'/>
                <Text className='text-green-500 text-sm'>Progressing well</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text className="text-gray-400 text-lg">No workout found.</Text>
      )}
    </View>
  );
}
