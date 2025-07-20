import Achievement from '@/interfaces/Achievement';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { storage } from '@/storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AchievementBadge from './AchievementBadge';
import { AchievementType } from '@/enums/achievement-type';

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

  useEffect(() => {
    setExerciseName(fetchExerciseNameFromId(achievement.exerciseId));
  }, []);

  const fetchExerciseNameFromId = (exerciseId: string) => {
    const exercisesString = storage.getString('data_exercises');
    const allExercises: ExerciseDefinition[] = exercisesString ? JSON.parse(exercisesString) : [];

    return allExercises.find(exercise => exercise.id === exerciseId)?.name || 'Unknown Exercise';
  }

  return (
    <View className={className + ' bg-card p-8 rounded-xl flex items-center justify-center'}>
      <Text className='text-txt-primary font-semibold text-xl'>{achievementTitles[achievement.type]}</Text>
      <View className='flex-row items-center gap-2'>
        <Text className='text-txt-primary'>{achievement.type}</Text>
        <Feather name="trending-up" size={20} color="#068bec" />
      </View>
      <AchievementBadge type={achievement.type} mainText={achievement.value.weight} smallText='KG' />
      <Text className='text-txt-primary font-semibold text-xl'>{exerciseName}</Text>
      <View className='flex-row items-center gap-2'>
        <Text className='text-txt-secondary'>{achievement.previousValue.weight} kg</Text>
        <AntDesign name="arrowright" size={14} color="#068bec" />
        <Text className='text-txt-secondary'>{achievement.value.weight} kg</Text>
      </View>
    </View>
  );
}
