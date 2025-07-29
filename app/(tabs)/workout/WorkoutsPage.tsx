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
import useOngoingWorkoutStore from '@/hooks/useOngoingWorkoutStore';
import WorkoutTimer from '@/components/shared/WorkoutTimer';
import useStatusBarStore from '@/hooks/useStatusBarStore';
import { IMPROMPTU_WORKOUT_ID, IMPROMPTU_WORKOUT_NAME } from '@/constants/StringConstants';

export default function WorkoutsPage() {
  const isFocused = useIsFocused();
  const [workouts, setWorkouts] = useState<WorkoutPageItem[]>([]);
  const clearWorkoutBuilder = useWorkoutBuilderStore(state => state.clearAll);
  const { fetchFromStorage } = useStorage();
  const resetOngoingWorkout = useOngoingWorkoutStore(state => state.resetAll);
  const setWorkoutStartedTimestamp = useOngoingWorkoutStore(state => state.setWorkoutStartedTimestamp);
  const setOngoingWorkout = useOngoingWorkoutStore(state => state.setWorkout);
  const ongoingWorkoutId = useOngoingWorkoutStore(state => state.workoutId);
  const ongoingWorkoutExerciseIds = useOngoingWorkoutStore(state => state.exerciseIds);
  const setStatusBarNode = useStatusBarStore(state => state.setNode);

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

    if (ongoingWorkoutId === IMPROMPTU_WORKOUT_ID) {
      const impromptuWorkout: WorkoutPageItem = {
        id: IMPROMPTU_WORKOUT_ID,
        title: IMPROMPTU_WORKOUT_NAME,
        exercises: ongoingWorkoutExerciseIds.map(exerciseId => {
          const exercise = allExercises.find(e => e.id === exerciseId);
          return exercise;
        }).filter(e => e !== undefined),
      };
      workoutPageItems.unshift(impromptuWorkout);
    }

    setWorkouts(workoutPageItems);
  }

  const handleCreateWorkoutPressed = () => {
    clearWorkoutBuilder();
    router.push('/workout/CreateWorkoutPage');
  }

  const handleImpromptuWorkoutPressed = () => {
    resetOngoingWorkout();
    setOngoingWorkout({
      id: IMPROMPTU_WORKOUT_ID,
      title: IMPROMPTU_WORKOUT_NAME,
      exerciseIds: [],
    });
    setStatusBarNode(<WorkoutTimer />);
    setWorkoutStartedTimestamp(Date.now());
    router.push('/workout/ViewWorkoutPage');
  }

  return (
    <ScrollView className='bg-primary flex-1 px-4' showsVerticalScrollIndicator={false}>
      <View className='flex items-center justify-center'>
        <Text className='text-txt-primary text-4xl font-bold text-left w-full mb-8 mt-12'>Your workouts</Text>
        {workouts.map((workout, index) =>
          <WorkoutTile
            className='mb-4'
            key={index}
            workoutPageItem={workout}
            isOngoing={workout.id === ongoingWorkoutId}
          />
        )}
        <View className='flex gap-4 items-center w-full'>
          <GradientPressable className='w-full' style='default' onPress={handleCreateWorkoutPressed}>
            <View className='flex-row items-center gap-2 px-4 py-2'>
              <AntDesign name="plus" size={14} color="white" />
              <Text className='text-white'>Create a new workout</Text>
            </View>
          </GradientPressable>
          <GradientPressable className='w-full' style='default' onPress={handleImpromptuWorkoutPressed}>
            <View className='flex-row items-center gap-2 px-4 py-2'>
              <AntDesign name="barschart" size={18} color="white" />
              <Text className='text-white'>Start an impromptu workout</Text>
            </View>
          </GradientPressable>
        </View>
      </View>
    </ScrollView>
  );
}