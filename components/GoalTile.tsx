import { Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

export type GoalTileProps = {
  mainText: string;
  subText: string;
};

export function GoalTile(props: GoalTileProps) {
  const pieData = [
    { value: 82, color: '#11f242', text: '82%' },
    { value: 18, color: '#ED6665', text: '18%' },
  ];

  return (
    <View className='bg-slate-700 flex items-center justify-center rounded-[20%] p-4 gap-2'>
      <Text className='text-white font-bold'>{props.subText}</Text>
      <View className=''>
        <PieChart
          donut
          radius={80}
          textSize={20}
          showTextBackground
          textBackgroundRadius={26}
          data={pieData}
          innerRadius={70}
          innerCircleColor={'#000000'}
          centerLabelComponent={() => {
            return <Text className='text-white text-3xl'>82%</Text>
          }}
        />
      </View>
    </View>
  );
}
