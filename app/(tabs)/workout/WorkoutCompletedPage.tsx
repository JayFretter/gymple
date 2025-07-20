import AchievementCard from '@/components/shared/AchievementCard';
import WorkoutTimer from '@/components/shared/WorkoutTimer';
import useCurrentWorkoutStore from '@/hooks/useCurrentWorkoutStore';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';

export default function WorkoutCompletedPage() {
  const isFocused = useIsFocused();
  const achievements = useCurrentWorkoutStore(state => state.achievements);
  const workoutStartedTimestamp = useCurrentWorkoutStore(state => state.workoutStartedTimestamp);
  
  const getFormattedWorkoutDuration = () => {
    if (!workoutStartedTimestamp) return '0m 0s';

    const elapsedTime = Date.now() - workoutStartedTimestamp;

    const totalSeconds = Math.floor(elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return (
    <View className="bg-primary px-4 flex-1 pt-">
      <Text className='text-txt-primary text-4xl mb-2'>Congratulations!</Text>
      <View className='flex-row items-center gap-2 mb-12'>
        <Text className='text-[#068bec] text-2xl'>Workout completed</Text>
        <SimpleLineIcons name="check" size={20} color="#068bec" />
      </View>
      <Text className='text-txt-primary text-2xl mb-8'>Achievements earned:</Text>
      <View className="mb-8">
        {achievements.length > 0 ? (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {
              achievements.map((achievement, index) => (
                <AchievementCard key={index} className='mr-2' achievement={achievement} />
              ))}
          </ScrollView>

        ) : (
          <Text className="text-txt-secondary">No achievements yet.</Text>
        )}
      </View>
      <Text className='text-txt-primary text-2xl mb-8'>Summary:</Text>
      <View className='flex-row gap-2'>
        <View className='bg-card p-4 rounded-xl'>
          <Text className='text-txt-primary font-semibold text-xl'>Duration</Text>
          <Text className='text-txt-secondary'>{getFormattedWorkoutDuration()}</Text>
        </View>
        <View className='bg-card p-4 rounded-xl'>
          <Text className='text-txt-primary font-semibold text-xl'>Total volume</Text>
          <Text className='text-txt-secondary'>2460 kg</Text>
        </View>
      </View>
    </View>
  );
}
