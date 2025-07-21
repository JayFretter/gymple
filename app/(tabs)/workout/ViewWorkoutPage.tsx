import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import WorkoutPageItem from '@/interfaces/WorkoutPageItem';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import EditableWorkoutExerciseList from '@/components/EditableWorkoutExerciseList';
import useWorkoutBuilderStore from '@/hooks/useWorkoutBuilderStore';
import GradientPressable from '@/components/shared/GradientPressable';
import useCurrentWorkoutStore from '@/hooks/useCurrentWorkoutStore';
import AntDesign from '@expo/vector-icons/AntDesign';
import useStorage from '@/hooks/useStorage';
import useStatusBarStore from '@/hooks/useStatusBarStore';
import WorkoutTimer from '@/components/shared/WorkoutTimer';

export default function ViewWorkoutPage() {
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();
  const [workoutDefinition, setWorkoutDefinition] = useState<WorkoutDefinition | null>(null);
  const [workout, setWorkout] = useState<WorkoutPageItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { fetchFromStorage } = useStorage();

  const setExercises = useWorkoutBuilderStore(state => state.setExercises);
  const clearAllExercises = useWorkoutBuilderStore(state => state.clearAll);

  const setWorkoutStartedTimestamp = useCurrentWorkoutStore(state => state.setWorkoutStartedTimestamp);
  const setCurrentWorkout = useCurrentWorkoutStore(state => state.setCurrentWorkout);
  const currentWorkout = useCurrentWorkoutStore(state => state.currentWorkout);
  const completedExercises = useCurrentWorkoutStore(state => state.performanceData).map(exercise => exercise.exerciseId);
  const clearCurrentWorkoutState = useCurrentWorkoutStore(state => state.resetAll);

  const setStatusBarNode = useStatusBarStore(state => state.setNode);

  useEffect(() => {
    if (isFocused) {
      fetchWorkout(params.workoutId as string);
    }
  }, [isFocused]);

  const handleWorkoutStarted = () => {
    if (workout && workoutDefinition) {
      clearCurrentWorkoutState();
      setWorkoutStartedTimestamp(Date.now());
      setCurrentWorkout(workoutDefinition);
      router.push({ pathname: '/workout/TrackExercisePage', params: { exerciseId: workout.exercises[0].id } });
      setStatusBarNode(<WorkoutTimer />);
    }
  }

  const fetchWorkout = (id: string) => {
    const allWorkouts = fetchFromStorage<WorkoutDefinition[]>('data_workouts');
    if (allWorkouts) {
      const currentWorkoutDef = allWorkouts.find(w => w.id === id);
      if (!currentWorkoutDef)
        return;

      setWorkoutDefinition(currentWorkoutDef);

      const allExercises = useFetchAllExercises();

      const exercises = currentWorkoutDef.exerciseIds.map(exerciseId => {
        const exercise = allExercises.find(e => e.id === exerciseId);
        return exercise;
      }).filter(e => e !== undefined);

      const workoutPageItem: WorkoutPageItem = {
        id: currentWorkoutDef.id,
        title: currentWorkoutDef.title,
        exercises
      };

      setWorkout(workoutPageItem);
    }
  }

  const toggleEditMode = () => {
    if (!isEditing) {
      setExercises(workout?.exercises || []);
      setIsEditing(true);
    } else {
      clearAllExercises();
      setIsEditing(false);
    }
  }

  const handleDonePressed = () => {
    setIsEditing(false);
    fetchWorkout(params.workoutId as string);
  }

  const renderWorkout = () => {
    if (workout) {
      return (
        <View>
          {!isEditing ? (
            <View className='max-h-full'>
              <TouchableOpacity className='mb-4 flex flex-row items-center gap-1 justify-end' onPress={() => toggleEditMode()}>
                <Text className='text-[#03a1fc] text-xl font-bold'>Edit</Text>
              </TouchableOpacity>
              <Text className="text-txt-primary text-4xl font-bold mb-8">{workout.title}</Text>
              {!currentWorkout ?
                <GradientPressable className='mb-4' style='default' onPress={handleWorkoutStarted}>
                  <Text className="text-txt-primary text-center font-semibold my-4 mx-4">Start Workout</Text>
                </GradientPressable>
                :
                <GradientPressable className='mb-4' style='default' onPress={() => router.push('/(tabs)/workout/WorkoutCompletedPage')}>
                  <Text className="text-txt-primary text-center font-semibold my-4 mx-4">Finish Workout</Text>
                </GradientPressable>
              }

              <ScrollView showsVerticalScrollIndicator={false}>
                {workout.exercises.map((exercise, index) => (
                  <TouchableOpacity
                    key={index}
                    className="bg-card p-4 rounded-lg mb-4"
                    onPress={() => router.push({ pathname: '/workout/TrackExercisePage', params: { exerciseId: exercise.id } })}
                  >
                    <Text className="text-txt-primary text-xl">{exercise.name}</Text>
                    {completedExercises.includes(exercise.id) &&
                      <View className='flex flex-row items-center gap-1 mt-2'>
                        <Text className='text-green-500 text-sm'>Completed</Text>
                        <AntDesign name="check" size={12} color="#22c55e" />
                      </View>
                    }
                    {/* <Text className='text-sm text-txt-secondary'>1RM (kg): {exercise.oneRepMaxInKg}</Text>
                    <Text className='text-sm text-txt-secondary'>Estimated 1RM (kg): {exercise.estimatedOneRepMaxInKg}</Text> */}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : <EditableWorkoutExerciseList workout={workout} onDonePressed={handleDonePressed} />}
        </View>
      )
    }

    return (
      <Text className="text-txt-secondary text-lg">No workout found.</Text>
    )
  }

  return (
    <View className="bg-primary px-4 flex-1">
      {renderWorkout()}
    </View>
  );
}
