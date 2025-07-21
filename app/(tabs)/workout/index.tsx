import { useEffect, useState } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import { WorkoutTile } from '@/components/WorkoutTile';
import { router } from 'expo-router';
import useWorkoutBuilderStore from '@/hooks/useWorkoutBuilderStore';
import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import WorkoutPageItem from '@/interfaces/WorkoutPageItem';
import AntDesign from '@expo/vector-icons/AntDesign';
import useStorage from '@/hooks/useStorage';
import GradientPressable from '@/components/shared/GradientPressable';

export default function WorkoutsPage() {
  const isFocused = useIsFocused();
  const [workouts, setWorkouts] = useState<WorkoutPageItem[]>([]);
  const clearWorkoutBuilder = useWorkoutBuilderStore(state => state.clearAll);
  const { fetchFromStorage } = useStorage();

  useEffect(() => {
    if (isFocused)
      fetchWorkoutPageItems();
  }, [isFocused])

  const fetchWorkoutPageItems = () => {
    const workoutDefs = fetchFromStorage<WorkoutDefinition[]>('data_workouts') ?? [];

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
    router.push('/workout/CreateWorkoutPage');
  }

  return (
    <ScrollView className='bg-primary flex-1 px-4' showsVerticalScrollIndicator={false}>
      <View className='flex items-center justify-center'>
        <Text className='text-txt-primary text-4xl font-bold text-left w-full mb-8 mt-12'>Your workouts</Text>
        {workouts.map((workout, index) =>
          <WorkoutTile className='mb-4' key={index} workoutPageItem={workout} />
        )}
        <View className='flex gap-4 items-center w-full'>
          <GradientPressable className='w-full' style='green' onPress={handleCreateWorkoutPressed}>
            <View className='flex-row items-center gap-2 px-4 py-2'>
              <AntDesign name="plus" size={14} color="white" />
              <Text className='text-white'>Create a new workout</Text>
            </View>
          </GradientPressable>
          <GradientPressable className='w-full' style='default' onPress={handleCreateWorkoutPressed}>
            <View className='flex-row items-center gap-2 px-4 py-2'>
              <AntDesign name="barschart" size={18} color="white" />
              <Text className='text-white'>Track a single exercise</Text>
            </View>
          </GradientPressable>
        </View>
      </View>
    </ScrollView>
  );
}