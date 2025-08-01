import { AchievementType } from '@/enums/achievement-type';
import { Image, Text, View } from 'react-native';

export type AchievementBadgeProps = {
  className?: string;
  type: AchievementType;
  mainText?: string | number;
  smallText?: string;
  small?: boolean;
};

const imageSources: { [key in AchievementType]: any } = {
  [AchievementType.OneRepMax]: require('../../assets/images/badge_1rm.png'),
  [AchievementType.EstimatedOneRepMax]: require('../../assets/images/badge_estimated1rm.png'),
  [AchievementType.TotalVolume]: require('../../assets/images/badge_volume.png'),
  [AchievementType.ExerciseVolume]: require('../../assets/images/badge_volume.png'),
  [AchievementType.PersonalRecord]: require('../../assets/images/badge_volume.png'),
  [AchievementType.FirstTime]: require('../../assets/images/badge_1st_timer.png'),
}

const offsetPercentageFromTop: { [key in AchievementType]: number } = {
  [AchievementType.OneRepMax]: 32,
  [AchievementType.EstimatedOneRepMax]: 32,
  [AchievementType.TotalVolume]: 42,
  [AchievementType.ExerciseVolume]: 42,
  [AchievementType.PersonalRecord]: 55,
  [AchievementType.FirstTime]: 0,
}

export default function AchievementBadge({ className, type, mainText, smallText, small }: AchievementBadgeProps) {
  const imageSize = small ? 45 : 160;
  const fontSizeMainText = small ? 24 : 46;
  const fontSizeSubText = small ? 12 : 23;

  return (
    <View className=''>
      <Image
        className='self-center'
        source={imageSources[type]}
        style={{ width: imageSize, height: imageSize }}
      />
      <View className='absolute flex-row justify-center w-full' style={{ top: `${offsetPercentageFromTop[type]}%` }}>
        <Text className='text-white' style={{
          fontFamily: 'SquadaOne',
          fontSize: fontSizeMainText,
          textShadowColor: '#585858',
          textShadowOffset: { width: 0, height: 4 },
          textShadowRadius: 8,
        }}>
          {mainText}
        </Text>
        <Text className='text-white self-end' style={{
          fontFamily: 'SquadaOne',
          fontSize: fontSizeSubText,
          textShadowColor: '#585858',
          textShadowOffset: { width: 0, height: 4 },
          textShadowRadius: 8,
        }}>
          {smallText}
        </Text>
      </View>
    </View>
  );
}
