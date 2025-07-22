import GoalDefinition from '@/interfaces/GoalDefinition';
import { Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { themes } from "@/utils/colour-scheme";
import { useColorScheme } from 'nativewind';

export type GoalTileProps = {
  goal: GoalDefinition;
};

export function GoalTile({goal}: GoalTileProps) {
  const progressCompletedColour = '#11f242'
  const progressRemainingColour = '#888888'
  const { colorScheme } = useColorScheme();
  const theme = themes[colorScheme ?? 'light'];

  const pieData = [
    { value: goal.percentage, color: progressCompletedColour },
    { value: 100-goal.percentage, color: progressRemainingColour },
  ];

  const cardColor = '#333333'

  return (
    <View className='w-full bg-card flex-row items-center justify-between rounded-xl p-4 gap-2'>
      <View className='flex'>
        <Text className='text-txt-primary font-bold'>{goal.associatedExerciseName}</Text>
        <Text className='text-txt-secondary text-sm'>{goal.weight} {goal.weightUnit} x {goal.reps} reps</Text>
      </View>
      <View className=''>
        <PieChart
          donut
          radius={35}
          textSize={20}
          showTextBackground
          data={pieData}
          innerRadius={30}
          innerCircleColor={cardColor} // TODO: Use the actual theme card color for the inner circle
          centerLabelComponent={() => {
            return <Text className='text-txt-primary text-3xl'>{Math.round(goal.percentage)}%</Text>
          }}
        />
      </View>
    </View>
  );
}
