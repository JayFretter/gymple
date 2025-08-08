import { View } from 'react-native';
import EditableWorkoutExerciseList from '@/components/EditableWorkoutExerciseList';
import { router } from 'expo-router';
import BgView from '@/components/shared/BgView';

export default function CreateWorkoutPage() {
  const goToNewWorkout = (workoutId: string) => {
    router.replace(`/(tabs)/workout/ViewWorkoutPage?workoutId=${workoutId}`)
  }

  return (
    <BgView className="pt-4">
      <EditableWorkoutExerciseList onSave={goToNewWorkout} focusOnTitle />
    </BgView>
  );
}
