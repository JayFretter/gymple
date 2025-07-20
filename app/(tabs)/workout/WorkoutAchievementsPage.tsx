import WorkoutTimer from '@/components/shared/WorkoutTimer';
import useCurrentWorkoutStore from '@/hooks/useCurrentWorkoutStore';
import { useIsFocused } from '@react-navigation/native';
import { Text, View } from 'react-native';

export default function WorkoutAchievementsPage() {
  const isFocused = useIsFocused();
  const achievements = useCurrentWorkoutStore(state => state.achievements);

  return (
    <View className="bg-primary px-4 flex-1">
      <WorkoutTimer />
      <Text className='text-txt-primary text-2xl mb-8'>Achievements:</Text>
      <View className="flex-1">
        {achievements.length > 0 ? (
          achievements.map((achievement, index) => (
            <View key={index} className='bg-card rounded-xl py-4 px-2 mb-2'>
              <Text className="text-txt-primary">{achievement.exerciseId}</Text>
              <Text className="text-txt-primary">{achievement.type}</Text>
              <Text className="text-txt-secondary">{achievement.value.weight}</Text>
            </View>
          ))
        ) : (
          <Text className="text-txt-secondary">No achievements yet.</Text>
        )}
      </View>
    </View>
  );
}
