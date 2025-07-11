import { View } from 'react-native';
import EditGoalForm from '@/components/EditGoalForm';
import { useLocalSearchParams } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import GoalDefinition from '@/interfaces/GoalDefinition';
import { storage } from '@/storage';
import uuid from 'react-native-uuid';

export default function EditGoalPage() {
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();
  const [goal2, setGoal2] = useState<GoalDefinition | null>(null);

  // useEffect(() => {
  //   if (isFocused) {
  //     fetchGoal();
  //   }
  // }, [isFocused]);

  // const fetchGoal = () => {
  //   if (!params.goalId) {
  //     initialiseNewGoal();
  //     return;
  //   }

  //   const storedGoalsString = storage.getString('data_goals');
  //   const storedGoals: GoalDefinition[] = storedGoalsString ? JSON.parse(storedGoalsString) : [];
  //   const goalToEdit = storedGoals.find(goal => goal.id === params.goalId);
  //   console.log(goalToEdit)
  //   setGoal2(goalToEdit || null);
  // }
  
  const initialiseNewGoal = () => {
    const newGoal: GoalDefinition = {
      id: uuid.v4(),
      associatedExerciseId: '',
      associatedExerciseName: '',
      weight: 0,
      reps: 0,
      percentage: 0,
    };
    setGoal2(newGoal);
  }

  return (
    <View className="px-4 pt-24 bg-gray-200 flex-1">
      <EditGoalForm goalId={params.goalId as string} />
    </View>
  );
}