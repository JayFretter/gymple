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
      className='bg-slate-700 w-full p-4 flex items-center justify-center rounded-3xl'
      onPress={() => router.push({ pathname: '/(workouts)/ViewWorkoutPage', params: { workoutId: workoutPageItem.id } })}
    >
      <Text className='text-4xl text-slate-300 mb-2 font-bold'>{workoutPageItem.title}</Text>
      {workoutPageItem.exercises.map((exercise, index) =>
        <Text key={index} className='text-gray-300'>{exercise.name}</Text>
      )}
    </TouchableOpacity>
  );
}
