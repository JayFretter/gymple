import WorkoutPageItem from '@/interfaces/WorkoutPageItem';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export type WorkoutTileProps = {
  className?: string;
  workoutPageItem: WorkoutPageItem;
};

export function WorkoutTile({ className, workoutPageItem }: WorkoutTileProps) {
  return (
    <TouchableOpacity
      className={(className ?? '') + ' bg-card shadow-lg w-full p-4 rounded-xl'}
      onPress={() => router.push({ pathname: '/workout/ViewWorkoutPage', params: { workoutId: workoutPageItem.id } })}
    >
      <Text className='text-2xl text-txt-primary mb-2 font-bold'>{workoutPageItem.title}</Text>
      {workoutPageItem.exercises.map((exercise, index) =>
        <Text key={index} className='text-txt-primary
          '>{exercise.name}</Text>
      )}
    </TouchableOpacity>
  );
}
