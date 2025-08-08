import EditGoalForm from '@/components/EditGoalForm';
import NavBar from '@/components/NavBar';
import BgView from '@/components/shared/BgView';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function EditGoalPage() {
  const params = useLocalSearchParams();

  return (
    <BgView>
      <EditGoalForm goalId={params.goalId as string} />
    </BgView>
  );
}