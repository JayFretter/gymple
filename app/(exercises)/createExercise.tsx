import { View } from 'react-native';
import CreateExerciseForm from '@/components/CreateExerciseForm';

export default function CreateExercise() {
  return (
    <View className="p-4 bg-slate-900 flex-1">
      <CreateExerciseForm />
    </View>
  );
}
