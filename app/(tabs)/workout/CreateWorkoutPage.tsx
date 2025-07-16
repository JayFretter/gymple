import { View } from 'react-native';
import EditableWorkoutExerciseList from '@/components/EditableWorkoutExerciseList';
import { router } from 'expo-router';

export default function CreateWorkoutPage() {
  return (
    <View className="px-4 bg-gray-200 flex-1">
      <EditableWorkoutExerciseList onDonePressed={() => router.back()} />
    </View>
  );
}
