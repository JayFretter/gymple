import { View } from 'react-native';
import CreateExerciseForm from '@/components/CreateExerciseForm';

export default function CreateExercisePage() {
  return (
    <View className="px-4 pt-24 bg-gray-200 flex-1">
      <CreateExerciseForm />
    </View>
  );
}
