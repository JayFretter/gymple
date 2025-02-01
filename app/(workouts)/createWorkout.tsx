import { View } from 'react-native';
import CreateWorkoutForm from '@/components/CreateWorkoutForm';

export default function CreateWorkout() {
  return (
    <View className="p-4 bg-slate-900 flex-1">
      <CreateWorkoutForm />
    </View>
  );
}
