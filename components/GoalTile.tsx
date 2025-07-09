import { Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

export type GoalTileProps = {
  goalName: string;
  percentage: number;
};

export function GoalTile(props: GoalTileProps) {
  const progressCompletedColour = '#11f242'
  const progressRemainingColour = '#888888'

  const pieData = [
    { value: props.percentage, color: progressCompletedColour, text: '82%' },
    { value: 100-props.percentage, color: progressRemainingColour, text: '18%' },
  ];

  return (
    <View className='bg-white flex items-center justify-center rounded-[10%] p-4 gap-2'>
      <Text className='text-black font-bold'>{props.goalName}</Text>
      <View className=''>
        <PieChart
          donut
          radius={60}
          textSize={20}
          showTextBackground
          // textBackgroundRadius={22}
          data={pieData}
          innerRadius={50}
          innerCircleColor={'#FFFFFF'}
          centerLabelComponent={() => {
            return <Text className='text-black text-3xl'>{Math.round(props.percentage)}%</Text>
          }}
        />
      </View>
    </View>
  );
}
