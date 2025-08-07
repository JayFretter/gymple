import { AchievementType } from '@/enums/achievement-type';
import useGetAchievementInfo from '@/hooks/useGetAchievementInfo';
import useStorage from '@/hooks/useStorage';
import useThemeColours from '@/hooks/useThemeColours';
import Achievement from '@/interfaces/Achievement';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import AchievementBadge from './AchievementBadge';

export type AchievementCardProps = {
  className?: string;
  achievement: Achievement;
};

export default function AchievementCard({ className, achievement }: AchievementCardProps) {
  const [exerciseName, setExerciseName] = useState<string>('');
  const { fetchFromStorage } = useStorage();
  const { getAchievementName } = useGetAchievementInfo();
  const themeColour = useThemeColours();

  useEffect(() => {
    setExerciseName(fetchExerciseNameFromId(achievement.exerciseId));
  }, []);

  const fetchExerciseNameFromId = (exerciseId: string) => {
    const allExercises = fetchFromStorage<ExerciseDefinition[]>('data_exercises') ?? [];

    return allExercises.find(exercise => exercise.id === exerciseId)?.name || 'Unknown Exercise';
  }

  const roundHalf = (num?: number) => {
    if (num === undefined || num === null)
      return undefined;

    return Math.round(num * 2) / 2;
  }

  // Animation: float up and down
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1200 }),
        withTiming(0, { duration: 1200 })
      ),
      -1,
      true
    );
  }, [float]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
    width: '100%'
  }));

  return (
    <View className={className + ' rounded-xl border-[1px] border-tertiary overflow-hidden'}>
      <LinearGradient colors={[themeColour('card'), themeColour('highlight')]} className='flex items-center justify-center p-8' >
        <Text className='text-txt-primary font-semibold text-xl'>{getAchievementName(achievement.type)}</Text>
        <View className='flex-row items-center gap-2'>
          <Text className='text-txt-primary'>{achievement.type}</Text>
          <Feather name="trending-up" size={20} color="#068bec" />
        </View>
        <Animated.View style={animatedStyle}>
          <AchievementBadge type={achievement.type} mainText={roundHalf(achievement.value.weight)} smallText={achievement.value.weight ? 'KG' : ''} />
        </Animated.View>
        <Text className='text-txt-primary font-semibold text-xl'>{exerciseName}</Text>

        {achievement.type !== AchievementType.FirstTime ?
          <View className='flex-row items-center gap-2'>
            <Text className='text-txt-secondary'>{roundHalf(achievement.previousValue.weight)} kg</Text>
            <AntDesign name="arrowright" size={14} color="#068bec" />
            <Text className='text-txt-secondary'>{roundHalf(achievement.value.weight)} kg</Text>
          </View> :
          <Text className='text-txt-secondary'>-</Text>
        }
      </LinearGradient>
    </View>
  );
}
