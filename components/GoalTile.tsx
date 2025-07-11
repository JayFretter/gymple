import GoalDefinition from '@/interfaces/GoalDefinition';
import { Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

export type GoalTileProps = {
  goal: GoalDefinition;
};

export function GoalTile({goal}: GoalTileProps) {
  const progressCompletedColour = '#11f242'
  const progressRemainingColour = '#888888'

  const pieData = [
    { value: goal.percentage, color: progressCompletedColour },
    { value: 100-goal.percentage, color: progressRemainingColour },
  ];

  return (
    <View className='bg-white flex items-center justify-center rounded-xl p-4 gap-2'>
      <Text className='text-black font-bold'>{goal.associatedExerciseName}</Text>
      <Text className='text-gray-800 text-sm'>{goal.weight} kg x {goal.reps} reps</Text>
      <View className=''>
        <PieChart
          donut
          radius={60}
          textSize={20}
          showTextBackground
          data={pieData}
          innerRadius={50}
          innerCircleColor={'#FFFFFF'}
          centerLabelComponent={() => {
            return <Text className='text-black text-3xl'>{Math.round(goal.percentage)}%</Text>
          }}
        />
      </View>
    </View>
  );
}
