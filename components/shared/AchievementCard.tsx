import Achievement from '@/interfaces/Achievement';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { storage } from '@/storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AchievementBadge from './AchievementBadge';

export type AchievementCardProps = {
  className?: string;
  achievement: Achievement;
};

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
      <Text className='text-txt-primary font-semibold text-xl'>{exerciseName}</Text>
      <AchievementBadge type={achievement.type} mainText={achievement.value.weight} smallText='KG' />
      <View className='flex-row items-center gap-2'>
        <Text className='text-txt-primary'>{achievement.type}</Text>
        <Feather name="trending-up" size={24} color="#068bec" />
      </View>
      <View className='flex-row items-center gap-2'>
        {/* TODO: put real previous value here */}
        <Text className='text-txt-secondary'>0 kg</Text>
        <AntDesign name="arrowright" size={18} color="#068bec" />
        <Text className='text-txt-secondary'>{achievement.value.weight} kg</Text>
      </View>
    </View>
  );
}
