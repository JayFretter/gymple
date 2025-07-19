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
      className={(className ?? '') + ' bg-white shadow-lg w-full p-4 rounded-xl'}
      onPress={() => router.push({ pathname: '/workout/ViewWorkoutPage', params: { workoutId: workoutPageItem.id } })}
    >
      <Text className='text-2xl text-text_secondary mb-4 font-bold'>{workoutPageItem.title}</Text>
      <View className='bg-gray-100 rounded-xl px-4 py-2 mb-4'>
        {workoutPageItem.exercises.map((exercise, index) =>
          <Text key={index} className='text-gray-900'>{exercise.name}</Text>
        )}
      </View>
      {/* <View className='flex-row items-center justify-center gap-2'>
        <MaterialCommunityIcons name="gesture-tap" size={20} color="#9ca3af" />
        <Text className='text-center text-gray-400'>Track workout</Text>
      </View> */}
    </TouchableOpacity>
  );
}
