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
      className={className + ' bg-card flex-row items-center justify-between rounded-xl p-4 gap-2 active:bg-primary'}
      onPress={() => router.push({ pathname: '/dashboard/EditGoalPage', params: { goalId: goal.id } })}
      // android_ripple={{ color: '#ccc' }}

    >
      <View className='flex-1'>
        <Text className='text-txt-primary font-bold'>{goal.associatedExerciseName}</Text>
        <Text className='text-txt-secondary text-sm'>{goal.weight} {goal.weightUnit} x {goal.reps} reps</Text>
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
            return <Text className='text-txt-primary text-2xl'>{Math.round(goal.percentage)}%</Text>
          }}
        />
      </View>
    </Pressable>
  );
}
