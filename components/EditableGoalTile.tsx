import GoalDefinition from '@/interfaces/GoalDefinition';
import { router } from 'expo-router';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

export type EditableGoalTileProps = {
  className?: string;
  goal: GoalDefinition;
};

export function EditableGoalTile({ className, goal }: EditableGoalTileProps) {
  const progressCompletedColour = '#11f242'
  const progressRemainingColour = '#888888'

  const pieData = [
    { value: goal.percentage, color: progressCompletedColour },
    { value: 100 - goal.percentage, color: progressRemainingColour },
  ];

  return (
    <Pressable 
      className={className + ' bg-white flex-row items-center justify-between rounded-xl p-4 gap-2 active:bg-gray-100'}
      onPress={() => router.push({ pathname: '/dashboard/EditGoalPage', params: { goalId: goal.id } })}
      // android_ripple={{ color: '#ccc' }}

    >
      <View className='flex-1'>
        <Text className='text-black font-bold'>{goal.associatedExerciseName}</Text>
        <Text className='text-gray-800 text-sm'>{goal.weight} {goal.weightUnit} x {goal.reps} reps</Text>
      </View>
      <View className=''>
        <PieChart
          donut
          radius={35}
          showTextBackground
          data={pieData}
          innerRadius={30}
          innerCircleColor={'#FFFFFF'}
          centerLabelComponent={() => {
            return <Text className='text-black text-2xl'>{Math.round(goal.percentage)}%</Text>
          }}
        />
      </View>
    </Pressable>
  );
}
