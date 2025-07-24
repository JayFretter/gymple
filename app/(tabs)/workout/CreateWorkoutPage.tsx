import { View } from 'react-native';
import EditableWorkoutExerciseList from '@/components/EditableWorkoutExerciseList';
import { router } from 'expo-router';

export default function CreateWorkoutPage() {
  const goToNewWorkout = (workoutId: string) => {
    router.replace(`/(tabs)/workout/ViewWorkoutPage?workoutId=${workoutId}`)
  }

  return (
    <View className="px-4 bg-primary flex-1 pt-4">
      <EditableWorkoutExerciseList onSave={goToNewWorkout} />
    </View>
  );
}
