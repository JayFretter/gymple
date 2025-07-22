import WorkoutPageItem from '@/interfaces/WorkoutPageItem';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import GradientPressable from './shared/GradientPressable';

export type WorkoutTileProps = {
  className?: string;
  workoutPageItem: WorkoutPageItem;
};

export function WorkoutTile({ className, workoutPageItem }: WorkoutTileProps) {
  return (
    <GradientPressable
      style='gray'
      className='w-full mb-4'
      onPress={() => router.push({ pathname: '/workout/ViewWorkoutPage', params: { workoutId: workoutPageItem.id } })}
    >
      <View className='p-4'>
        <Text className='text-2xl text-txt-primary mb-2 font-bold'>{workoutPageItem.title}</Text>
        {workoutPageItem.exercises.map((exercise, index) =>
          <Text key={index} className='text-txt-primary
          '>{exercise.name}</Text>
        )}
      </View>
    </GradientPressable>
  );
}
