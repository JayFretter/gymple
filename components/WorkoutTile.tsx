import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import WorkoutPageItem from '@/interfaces/WorkoutPageItem';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export type WorkoutTileProps = {
  workoutPageItem: WorkoutPageItem;
};

export function WorkoutTile({workoutPageItem}: WorkoutTileProps) {
  return (
    <TouchableOpacity
      className='bg-white shadow-lg w-full p-4 rounded-3xl'
      onPress={() => router.push({ pathname: '/(workouts)/ViewWorkoutPage', params: { workoutId: workoutPageItem.id } })}
    >
      <Text className='text-2xl text-gray-800 mb-2 font-bold'>{workoutPageItem.title}</Text>
      {workoutPageItem.exercises.map((exercise, index) =>
        <Text key={index} className='text-gray-900'>{exercise.name}</Text>
      )}
    </TouchableOpacity>
  );
}
