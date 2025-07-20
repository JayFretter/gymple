import Achievement from '@/interfaces/Achievement';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { storage } from '@/storage';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

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
    <View className={className + ' bg-card p-8 rounded-xl flex'}>
      <Text className='text-txt-primary font-semibold text-xl'>{exerciseName}</Text>
      <Image
        className='self-center mb-4 mt-4'
        source={require('../../assets/images/trophy-placeholder.png')}
        style={{width: 140, height: 140}}
      />
      <View className='flex-row items-center gap-2'>
        <Text className='text-txt-primary'>{achievement.type}</Text>
        <Feather name="trending-up" size={24} color="#068bec" />
      </View>
      <View className='flex-row items-center gap-2'>
        {/* TODO: put real previous value here */ }
        <Text className='text-txt-secondary'>0 kg</Text>
        <AntDesign name="arrowright" size={18} color="#068bec" />
        <Text className='text-txt-secondary'>{achievement.value.weight} kg</Text>
      </View>
    </View>
  );
}
