import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import WorkoutPageItem from '@/interfaces/WorkoutPageItem';
import { storage } from '@/storage';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import EditableWorkoutExerciseList from '@/components/EditableWorkoutExerciseList';
import useWorkoutBuilderStore from '@/hooks/useWorkoutBuilderStore';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ViewWorkoutPage() {
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();
  const [workout, setWorkout] = useState<WorkoutPageItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const setExercises = useWorkoutBuilderStore(state => state.setExercises);
  const clearAllExercises = useWorkoutBuilderStore(state => state.clearAll);

  useEffect(() => {
    if (isFocused) {
      fetchWorkout(params.workoutId as string);
    }
  }, [isFocused]);

  const fetchWorkout = (id: string) => {
    const workouts = storage.getString('data_workouts');
    if (workouts) {
      const allWorkouts = JSON.parse(workouts) as WorkoutDefinition[];
      const currentWorkoutDef = allWorkouts.find(w => w.id === id);
      if (!currentWorkoutDef)
        return;

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
            <>
              <TouchableOpacity className='mb-4 flex flex-row items-center gap-1 justify-end' onPress={() => toggleEditMode()}>
                <Text className='text-[#03a1fc] text-xl'>Edit</Text>
                <AntDesign name="edit" size={16} color="#03a1fc" />
              </TouchableOpacity>
              <Text className="text-white text-4xl font-bold mb-8">{workout.title}</Text>
              {workout.exercises.map((exercise, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-gray-700 p-4 rounded-lg mb-3"
                  onPress={() => router.push({ pathname: '/(exercises)/TrackExercisePage', params: { exerciseId: exercise.id } })}
                >
                  <Text className="text-gray-200 text-xl mb-2">{exercise.name}</Text>
                  <View className='flex flex-row items-center gap-2'>
                    <View className='w-1 h-1 bg-green-500 rounded-full' />
                    <Text className='text-green-500 text-sm'>Progressing well</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : <EditableWorkoutExerciseList workout={workout} onDonePressed={handleDonePressed} />}
        </View>
      )
    }

    return (
      <Text className="text-gray-400 text-lg">No workout found.</Text>
    )
  }

  return (
    <View className="bg-gray-900 px-4 pt-12 flex-1">
      {renderWorkout()}
    </View>
  );
}
