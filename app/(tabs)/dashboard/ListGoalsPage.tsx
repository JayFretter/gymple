import { EditableGoalTile } from '@/components/EditableGoalTile';
import NavBar from '@/components/NavBar';
import useDeleteGoal from '@/hooks/useDeleteGoal';
import useStorage from '@/hooks/useStorage';
import GoalDefinition from '@/interfaces/GoalDefinition';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

export default function ListGoalsPage() {
  const isFocused = useIsFocused();
  const [goals, setGoals] = useState<GoalDefinition[]>([]);
  const deleteGoal = useDeleteGoal();
  const { fetchFromStorage } = useStorage();

  useEffect(() => {
    if (isFocused)
      fetchGoals();
  }, [isFocused]);

  const fetchGoals = () => {
    const storedGoals = fetchFromStorage<GoalDefinition[]>('data_goals') ?? [];
    setGoals(storedGoals);
  }

  const handleDeleteGoal = (goalId: string) => {
    deleteGoal(goalId);
    fetchGoals();
  }

  return (
    <>
      <View className="px-4 pt-4 bg-primary flex-1">
        <TouchableOpacity className='self-end'>
          <Text className='text-blue-500 text-lg mb-4' onPress={() => router.push('/dashboard/EditGoalPage')}>+ New goal</Text>
        </TouchableOpacity>
        <Text className='text-txt-primary text-2xl font-bold mb-2'>Your current goals:</Text>
        <Text className='text-txt-secondary mb-8'>Tap on any goal to edit it. Swipe left to delete.</Text>
        <SwipeListView
          showsVerticalScrollIndicator={false}
          disableRightSwipe
          onEndReachedThreshold={0.3}
          data={goals}
          renderItem={(data) => (
            <EditableGoalTile className='' goal={data.item} />
          )}
          renderHiddenItem={(data) => (
            <View className="bg-red-600 border border-gray-700 h-full flex-row items-center justify-end rounded-xl">
              <TouchableOpacity className="flex justify-center pr-4" onPress={() => handleDeleteGoal(data.item.id)}>
                <Text className='text-white text-right'>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={() => <View className='h-2' />}
          leftOpenValue={0}
          rightOpenValue={-75}
          recalculateHiddenLayout={true}
        />
      </View>
    </>
  );
}
