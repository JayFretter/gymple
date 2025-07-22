import EditGoalForm from '@/components/EditGoalForm';
import NavBar from '@/components/NavBar';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function EditGoalPage() {
  const params = useLocalSearchParams();

  return (
    <>
      <View className="px-4 pt-24 bg-primary flex-1">
        <EditGoalForm goalId={params.goalId as string} />
      </View>
    </>
  );
}