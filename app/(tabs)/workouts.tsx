import { storage } from '@/storage';
import { useEffect, useState } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import { WorkoutTile } from '@/components/WorkoutTile';
import { router } from 'expo-router';
import useWorkoutBuilderStore from '@/hooks/useWorkoutBuilderStore';
import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import WorkoutPageItem from '@/interfaces/WorkoutPageItem';

export default function WorkoutsPage() {
  const isFocused = useIsFocused();
  const [workouts, setWorkouts] = useState<WorkoutPageItem[]>([]);
  const clearWorkoutBuilder = useWorkoutBuilderStore(state => state.clearAll);

  useEffect(() => {
    if (isFocused)
      fetchWorkoutPageItems();
  }, [isFocused])

  const fetchWorkoutPageItems = () => {
    const workouts = storage.getString('data_workouts');
    const workoutDefs: WorkoutDefinition[] = workouts ? JSON.parse(workouts) : [];

    const allExercises = useFetchAllExercises();

    const workoutPageItems: WorkoutPageItem[] = workoutDefs.map(workout => {
      const exercises = workout.exerciseIds.map(exerciseId => {
        const exercise = allExercises.find(e => e.id === exerciseId);
        return exercise;
      });

      return { id: workout.id, title: workout.title, exercises: exercises.filter(e => e !== undefined) };
    });

    setWorkouts(workoutPageItems);
  }

  const handleCreateWorkoutPressed = () => {
    clearWorkoutBuilder();
    router.push('/(workouts)/CreateWorkoutPage');
  }

  return (
    <ScrollView className='bg-gray-200 flex-1 pt-12 px-4'>
      <View className='flex items-center justify-center gap-8'>
        <TouchableOpacity
          className="flex-row w-full justify-end"
          onPress={() => handleCreateWorkoutPressed()}
        >
          <Text className="text-[#03a1fc] text-lg font-semibold">+ New</Text>
        </TouchableOpacity>
        <Text className='text-gray-800 text-4xl font-bold text-left w-full'>Your workouts:</Text>
        {workouts.map((workout, index) =>
          <WorkoutTile key={index} workoutPageItem={workout} />
        )}
      </View>
    </ScrollView>
  );
}