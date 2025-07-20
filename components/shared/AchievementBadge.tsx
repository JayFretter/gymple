import { AchievementType } from '@/enums/achievement-type';
import { Image, Text, View } from 'react-native';

export type AchievementBadgeProps = {
  className?: string;
  type: AchievementType;
  mainText?: string | number;
  smallText?: string;
};

const imageSources: { [key in AchievementType]: any } = {
  [AchievementType.OneRepMax]: require('../../assets/images/badge_1rm.png'),
  [AchievementType.EstimatedOneRepMax]: require('../../assets/images/badge_estimated1rm.png'),
  [AchievementType.TotalVolume]: require('../../assets/images/badge_volume.png'),
  [AchievementType.PersonalRecord]: require('../../assets/images/badge_volume.png'),
}

const offsetPercentages: { [key in AchievementType]: number } = {
  [AchievementType.OneRepMax]: 35,
  [AchievementType.EstimatedOneRepMax]: 35,
  [AchievementType.TotalVolume]: 50,
  [AchievementType.PersonalRecord]: 50,
}

export default function AchievementBadge({ className, type, mainText, smallText }: AchievementBadgeProps) {
  return (
    <View className='w-full'>
      <Image
        className='self-center'
        source={imageSources[type]}
        style={{ width: 160, height: 160 }}
      />
      <View className='absolute flex-row w-full justify-center' style={{top: `${offsetPercentages[type]}%`}}>
        <Text className='text-white font-bold text-4xl'>{mainText}</Text>
        <Text className='text-white font-bold text-sm self-end'>{smallText}</Text>
      </View>
    </View>
  );
}
