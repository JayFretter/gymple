import EditableWorkoutExerciseList from '@/components/EditableWorkoutExerciseList';
import ModifyOngoingWorkoutPage from '@/components/ModifyOngoingWorkoutPage';
import GradientPressable from '@/components/shared/GradientPressable';
import WorkoutTimer from '@/components/shared/WorkoutTimer';
import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import useOngoingWorkoutStore from '@/hooks/useOngoingWorkoutStore';
import useStatusBarStore from '@/hooks/useStatusBarStore';
import useStorage from '@/hooks/useStorage';
import useWorkoutBuilderStore from '@/hooks/useWorkoutBuilderStore';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow'

export default function ViewWorkoutPage() {
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();
  const [workout, setWorkout] = useState<WorkoutDefinition | null>(null);
  const [exercises, setExercises] = useState<ExerciseDefinition[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const { fetchFromStorage } = useStorage();

  const setWorkoutBuilderExercises = useWorkoutBuilderStore(state => state.setExercises);
  const clearWorkoutBuilderState = useWorkoutBuilderStore(state => state.clearAll);

  const setWorkoutStartedTimestamp = useOngoingWorkoutStore(state => state.setWorkoutStartedTimestamp);
  const setWorkoutFinishedTimestamp = useOngoingWorkoutStore(state => state.setWorkoutFinishedTimestamp);
  const setOngoingWorkout = useOngoingWorkoutStore(state => state.setWorkout);

  const ongoingWorkoutId = useOngoingWorkoutStore(state => state.workoutId);
  const ongoingWorkoutExerciseIds = useOngoingWorkoutStore(state => state.exerciseIds);

  const completedExercises = useOngoingWorkoutStore(state => state.performanceData).map(exercise => exercise.exerciseId);
  const resetOngoingWorkoutState = useOngoingWorkoutStore(state => state.resetAll);

  const setStatusBarNode = useStatusBarStore(state => state.setNode);

  useEffect(() => {
    if (isFocused) {
      fetchWorkout(params.workoutId as string);
    }
  }, [isFocused, ongoingWorkoutExerciseIds]);

  const handleWorkoutStarted = () => {
    if (workout && workout) {
      resetOngoingWorkoutState();
      setWorkoutStartedTimestamp(Date.now());
      setOngoingWorkout(workout);
      router.push({ pathname: '/workout/TrackExercisePage', params: { exerciseId: workout.exerciseIds[0] } });
      setStatusBarNode(<WorkoutTimer />);
    }
  }

  const fetchWorkout = (id: string) => {
    const allWorkouts = fetchFromStorage<WorkoutDefinition[]>('data_workouts');
    if (allWorkouts) {
      const currentWorkoutDef = allWorkouts.find(w => w.id === id);
      if (!currentWorkoutDef)
        return;

      setWorkout(currentWorkoutDef);

      const allExercises = useFetchAllExercises();

      if (ongoingWorkoutId === id) {
        console.log('ongoing exercise ids:', ongoingWorkoutExerciseIds);
        const exercises = ongoingWorkoutExerciseIds.map(exerciseId => {
          const exercise = allExercises.find(e => e.id === exerciseId);
          return exercise;
        }).filter(e => e !== undefined);
  
        setExercises(exercises);
      } else {
        const exercises = currentWorkoutDef.exerciseIds.map(exerciseId => {
          const exercise = allExercises.find(e => e.id === exerciseId);
          return exercise;
        }).filter(e => e !== undefined);
  
        setExercises(exercises);
      }
    }
  }

  const toggleEditMode = () => {
    if (!isEditing) {
      setWorkoutBuilderExercises(exercises);
      setIsEditing(true);
    } else {
      clearWorkoutBuilderState();
      setIsEditing(false);
    }
  }

  const handleWorkoutEditingFinished = () => {
    setIsEditing(false);
    fetchWorkout(params.workoutId as string);
  }

  const handleWorkoutFinished = () => {
    setWorkoutFinishedTimestamp(Date.now());
    router.push('/(tabs)/workout/WorkoutCompletedPage');
  }

  const renderEditWorkoutPage = () => {
    if (ongoingWorkoutId) {
      return <ModifyOngoingWorkoutPage onDonePressed={handleWorkoutEditingFinished} />
    }
    else {
      if (!workout)
        return;

      return <EditableWorkoutExerciseList workout={workout} onSave={handleWorkoutEditingFinished} />
    }
  }

  const renderWorkout = () => {
    if (workout) {
      return (
        <View className='pt-4'>
          {!isEditing ? (
            <View className='max-h-full'>
              <TouchableOpacity className='mb-4 flex flex-row items-center gap-1 justify-end' onPress={toggleEditMode}>
                <Text className='text-[#03a1fc] text-xl font-bold'>Edit</Text>
              </TouchableOpacity>
              <Text className="text-txt-primary text-4xl font-bold mb-8">{workout.title}</Text>
              {/* TODO: add logic to not show finish workout if ongoing workout is a different workout to this one */}
              {!ongoingWorkoutId ?
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
                {exercises.map((exercise, index) => (
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
                {ongoingWorkoutId && (
                  <View className='mt-8'>
                    <Text className='text-txt-secondary mb-2'>Switching it up? Tap below to modify the workout for this session only.</Text>
                    <GradientPressable className='mb-4' style='gray' onPress={toggleEditMode}>
                      <View className='flex-row items-center justify-center gap-2 py-2'>
                        <Text className="text-txt-primary text-center">Modify workout</Text>
                        <AntDesign name="edit" size={14} color="white" />
                      </View>
                    </GradientPressable>
                  </View>

                )

                }
              </ScrollView>
            </View>
          ) : (
            renderEditWorkoutPage()
          )
          }
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
