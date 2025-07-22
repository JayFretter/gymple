import Achievement from '@/interfaces/Achievement';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AchievementBadge from './AchievementBadge';
import { AchievementType } from '@/enums/achievement-type';
import useStorage from '@/hooks/useStorage';
import { LinearGradient } from 'expo-linear-gradient';

export type AchievementCardProps = {
  className?: string;
  achievement: Achievement;
};

const achievementTitles: { [key in AchievementType]: string } = {
  [AchievementType.OneRepMax]: 'Heavy Hauler',
  [AchievementType.EstimatedOneRepMax]: 'Could-Be Heavy Hauler',
  [AchievementType.TotalVolume]: 'Workhorse',
  [AchievementType.ExerciseVolume]: 'Upgraded Machinery',
  [AchievementType.PersonalRecord]: 'PB',
}

export default function AchievementCard({ className, achievement }: AchievementCardProps) {
  const isFocused = useIsFocused();
  const [exerciseName, setExerciseName] = useState<string>('');
  const { fetchFromStorage } = useStorage();

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

  return (
    <View className={className + ' rounded-xl border-[1px] border-gray-700 overflow-hidden'}>
      <LinearGradient colors={['#111111', '#333377']} className='flex items-center justify-center p-8' >
        <Text className='text-txt-primary font-semibold text-xl'>{achievementTitles[achievement.type]}</Text>
        <View className='flex-row items-center gap-2'>
          <Text className='text-txt-primary'>{achievement.type}</Text>
          <Feather name="trending-up" size={20} color="#068bec" />
        </View>
        <AchievementBadge type={achievement.type} mainText={roundHalf(achievement.value.weight)} smallText='KG' />
        <Text className='text-txt-primary font-semibold text-xl'>{exerciseName}</Text>
        <View className='flex-row items-center gap-2'>
          <Text className='text-txt-secondary'>{roundHalf(achievement.previousValue.weight)} kg</Text>
          <AntDesign name="arrowright" size={14} color="#068bec" />
          <Text className='text-txt-secondary'>{roundHalf(achievement.value.weight)} kg</Text>
        </View>
      </LinearGradient>
    </View>
  );
}
