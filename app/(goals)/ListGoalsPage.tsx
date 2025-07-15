import { EditableGoalTile } from '@/components/EditableGoalTile';
import GoalDefinition from '@/interfaces/GoalDefinition';
import { storage } from '@/storage';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function ListGoalsPage() {
  const isFocused = useIsFocused();
  const [goals, setGoals] = useState<GoalDefinition[]>([]);

  useEffect(() => {
    if (isFocused)
      fetchGoals();
  }, [isFocused]);

  const fetchGoals = () => {
    const storedGoalsString = storage.getString('data_goals');
    const storedGoals: GoalDefinition[] = storedGoalsString ? JSON.parse(storedGoalsString) : [];
    setGoals(storedGoals);
  }

  return (
    <View className="px-4 pt-4 bg-gray-200 flex-1">
      <TouchableOpacity className='self-end'>
        <Text className='text-blue-500 text-lg mb-4' onPress={() => router.push('/(goals)/EditGoalPage')}>+ New goal</Text>
      </TouchableOpacity>
      <Text className='text-2xl font-bold mb-2'>Your current goals:</Text>
      <Text className='text-gray-600 mb-8'>Tap on any goal to edit it</Text>
      <ScrollView>
        <View className='flex-1 justify-center gap-4 mb-12'>
        {
          goals.map((goal, index) => (
            <EditableGoalTile key={index} goal={goal} />
          ))
        }
        </View>
      </ScrollView>
    </View>
  );
}
