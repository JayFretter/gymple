import EditableWorkoutExerciseList from '@/components/EditableWorkoutExerciseList';
import GradientPressable from '@/components/shared/GradientPressable';
import WorkoutTimer from '@/components/shared/WorkoutTimer';
import useCurrentWorkoutStore from '@/hooks/useCurrentWorkoutStore';
import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import useStatusBarStore from '@/hooks/useStatusBarStore';
import useStorage from '@/hooks/useStorage';
import useWorkoutBuilderStore from '@/hooks/useWorkoutBuilderStore';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import WorkoutPageItem from '@/interfaces/WorkoutPageItem';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
  const setWorkoutFinishedTimestamp = useCurrentWorkoutStore(state => state.setWorkoutFinishedTimestamp);
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

  const handleWorkoutFinished = () => {
    setWorkoutFinishedTimestamp(Date.now());
    router.push('/(tabs)/workout/WorkoutCompletedPage');
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
                  <View className='flex-row items-center justify-center gap-2 py-2'>
                    <MaterialCommunityIcons name="dumbbell" size={18} color="white" />
                    <Text className="text-txt-primary text-center font-semibold">Start Workout</Text>
                  </View>
                </GradientPressable>
                :
                <GradientPressable className='mb-4' style='default' onPress={handleWorkoutFinished}>
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
