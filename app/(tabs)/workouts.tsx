import { storage } from '@/storage';
import { useEffect, useState } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import { WorkoutTile } from '@/components/WorkoutTile';
import CreateExerciseForm from '@/components/CreateExerciseForm';
import CreateWorkoutForm from '@/components/CreateWorkoutForm';
import { Link } from 'expo-router';

export default function WorkoutsPage() {
  const isFocused = useIsFocused();
  const [workouts, setWorkouts] = useState<WorkoutDefinition[]>([]);

  useEffect(() => {
    if (isFocused)
      fetchWorkouts();
  }, [isFocused])

  const saveWorkout = () => {
    const dummyWorkout = { title: 'Push Day', exercises: ['Bench Press', 'Overhead Press', 'Tricep Extension'] };
    storage.set('data_workouts', JSON.stringify([dummyWorkout]));
    console.log('Workout saved:', dummyWorkout);
  }

  const fetchWorkouts = () => {
    const workouts = storage.getString('data_workouts');
    if (workouts) {
      console.log('Workouts:', workouts);
      setWorkouts(JSON.parse(workouts));
    } else {
      console.log('No workouts found');
    }
  }

  const debugClearAllWorkouts = () => {
    storage.delete('data_workouts');
    setWorkouts([]);
  }

  return (
    <ScrollView className='bg-slate-900 flex-1'>
      <View className='flex items-center justify-center mt-20 gap-12'>
        <TouchableOpacity
          className="bg-red-800 py-3 px-4 rounded-lg"
          onPress={debugClearAllWorkouts}
        >
          <Text className="text-white text-center font-semibold">Debug: Clear all workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-green-500 py-3 px-4 rounded-lg"
          onPress={saveWorkout}
        >
          <Text className="text-white text-center font-semibold">Create a new workout!</Text>
        </TouchableOpacity>
        <Link className='text-white underline' href="../(exercises)/selectExercise">Select Exercise</Link>
        <Text className='text-gray-300'>Your workouts:</Text>
        {workouts.map((workout, index) =>
          <WorkoutTile key={index} title={workout.title} exercises={workout.exercises} />
        )}
        <CreateWorkoutForm />
        <CreateExerciseForm />
      </View>

    </ScrollView>
  );
}