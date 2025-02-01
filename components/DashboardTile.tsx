import { Text, View } from 'react-native';

export type DashboardTileProps = {
  mainText: string;
  subText: string;
};

export function DashboardTile(props: DashboardTileProps) {
  return (
    <View className='bg-slate-700 w-64 h-64 flex items-center justify-center rounded-[20%]'>
        <Text className='text-7xl text-green-300'>{props.mainText}</Text>
        <Text className='text-gray-300'>{props.subText}</Text>
      </View>
  );
}
