import { View } from 'react-native';
import CreateWorkoutForm from '@/components/CreateWorkoutForm';

export default function CreateWorkoutPage() {
  return (
    <View className="px-4 pt-24 bg-gray-200 flex-1">
      <CreateWorkoutForm />
    </View>
  );
}
