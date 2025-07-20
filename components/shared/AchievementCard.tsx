import Achievement from '@/interfaces/Achievement';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { storage } from '@/storage';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

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
    <View className={className + ' bg-card p-8 rounded-xl'}>
      <Text className='text-txt-primary font-semibold text-xl'>{exerciseName}</Text>
      <View className='flex-row items-center gap-2'>
        <Text className='text-txt-primary'>{achievement.type}</Text>
        <Feather name="trending-up" size={24} color="#068bec" />
      </View>
      <Text className='text-txt-secondary'>{achievement.value.weight} kg</Text>
    </View>
  );
}
