import WorkoutPageItem from '@/interfaces/WorkoutPageItem';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import GradientPressable from './shared/GradientPressable';

export type WorkoutTileProps = {
  className?: string;
  workoutPageItem: WorkoutPageItem;
  isOngoing?: boolean;
};

export function WorkoutTile({ className, workoutPageItem, isOngoing }: WorkoutTileProps) {
  return (
    <GradientPressable
      style={isOngoing ? 'default' : 'gray'}
      className='w-full mb-4'
      onPress={() => router.push({ pathname: '/workout/ViewWorkoutPage', params: { workoutId: workoutPageItem.id } })}
    >
      <View className='p-4'>
        <Text className='text-2xl text-txt-primary mb-2 font-bold border-b border-gray-700 pb-2'>{workoutPageItem.title}</Text>
        {workoutPageItem.exercises.map((exercise, index) =>
          <Text key={index} className='text-txt-secondary'>{exercise.name}</Text>
        )}
        {isOngoing && (
          <View className='flex-row items-center mt-2 gap-1'>
            <MaterialCommunityIcons name="run" size={16} color="#bfdbfe" />
            <Text className='text-blue-200 font-semibold'>Ongoing</Text>
          </View>
        )}
      </View>
    </GradientPressable>
  );
}
