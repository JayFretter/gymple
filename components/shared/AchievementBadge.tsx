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
  [AchievementType.ExerciseVolume]: require('../../assets/images/badge_volume.png'),
  [AchievementType.PersonalRecord]: require('../../assets/images/badge_volume.png'),
}

const offsetPercentageFromTop: { [key in AchievementType]: number } = {
  [AchievementType.OneRepMax]: 34,
  [AchievementType.EstimatedOneRepMax]: 34,
  [AchievementType.TotalVolume]: 45,
  [AchievementType.ExerciseVolume]: 45,
  [AchievementType.PersonalRecord]: 55,
}

export default function AchievementBadge({ className, type, mainText, smallText }: AchievementBadgeProps) {
  return (
    <View className='w-full'>
      <Image
        className='self-center'
        source={imageSources[type]}
        style={{ width: 160, height: 160 }}
      />
      <View className='absolute flex-row w-full justify-center' style={{top: `${offsetPercentageFromTop[type]}%`}}>
        <Text className='text-white text-5xl' style={{fontFamily: 'SquadaOne'}}>{mainText}</Text>
        <Text className='text-white text-lg self-end' style={{fontFamily: 'SquadaOne'}}>{smallText}</Text>
      </View>
    </View>
  );
}
