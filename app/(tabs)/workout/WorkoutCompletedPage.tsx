import { GoalTile } from '@/components/GoalTile';
import AchievementCard from '@/components/shared/AchievementCard';
import WorkoutTimer from '@/components/shared/WorkoutTimer';
import { AchievementType } from '@/enums/achievement-type';
import useCurrentWorkoutStore from '@/hooks/useCurrentWorkoutStore';
import Achievement from '@/interfaces/Achievement';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';

export default function WorkoutCompletedPage() {
  const isFocused = useIsFocused();

  const testAchievements: Achievement[] = [
    {
      exerciseId: '1',
      type: AchievementType.OneRepMax,
      value: {
        weight: 100
      }
    },
    {
      exerciseId: '1',
      type: AchievementType.EstimatedOneRepMax,
      value: {
        weight: 105
      }
    },
    {
      exerciseId: '1',
      type: AchievementType.TotalVolume,
      value: {
        weight: 2500
      }
    }
  ]


  // const achievements = useCurrentWorkoutStore(state => state.achievements);
  const achievements = testAchievements;


  const currentWorkout = useCurrentWorkoutStore(state => state.currentWorkout);
  const completedGoals = useCurrentWorkoutStore(state => state.completedGoals);
  const performanceData = useCurrentWorkoutStore(state => state.performanceData);
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
    <ScrollView className="bg-primary px-4 flex-1">
      <Text className='text-txt-primary text-4xl text-center font-semibold mb-1'>{currentWorkout?.title}</Text>
      <View className='flex-row items-center gap-2 mb-12 mx-auto'>
        <Text className='text-[#068bec] text-xl'>Workout complete</Text>
        <SimpleLineIcons name="check" size={14} color="#068bec" />
      </View>
      <Text className='text-txt-secondary text-xl text-center mb-4'>Achievements earned:</Text>
      <View className="mb-8 mx-auto">
        {achievements.length > 0 ? (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {
              achievements.map((achievement, index) => (
                <AchievementCard key={index} className='mr-4' achievement={achievement} />
              ))}
          </ScrollView>

        ) : (
          <Text className="text-txt-secondary">No achievements yet.</Text>
        )}
      </View>

      <Text className='text-txt-secondary text-xl text-center mb-4'>Goals completed:</Text>
      <View className="mb-8 mx-auto">
        {completedGoals.length > 0 ? (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {
              completedGoals.map((goal, index) => (
                <GoalTile key={index} goal={goal} />
              ))}
          </ScrollView>

        ) : (
          <Text className="text-txt-secondary">No goals completed this session.</Text>
        )}
      </View>

      <Text className='text-txt-secondary text-xl text-center mb-4'>Exercises completed:</Text>
      <View className="mb-8 mx-auto">
        {performanceData.length > 0 ? (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {
              performanceData.map((performance, index) => (
                <View key={index} className='bg-card rounded-xl p-4 flex gap-2'>
                  <Text className='text-txt-primary font-semibold'>{performance.exerciseId}</Text>
                  <Text className='text-txt-secondary'>Sets: {performance.sets.length}</Text>
                  <Text className='text-txt-secondary'>Total reps: {performance.sets.reduce((acc, curr) => acc + curr.reps, 0)}</Text>
                </View>
              ))}
          </ScrollView>

        ) : (
          <Text className="text-txt-secondary">No exercises completed this session.</Text>
        )}
      </View>

      <Text className='text-txt-secondary text-xl text-center mb-4'>Summary:</Text>
      <View className='flex-row gap-2'>
        <View className='bg-card p-4 rounded-xl border-[1px] border-gray-700'>
          <Text className='text-txt-primary font-semibold text-xl'>Duration</Text>
          <Text className='text-txt-secondary'>{getFormattedWorkoutDuration()}</Text>
        </View>
        <View className='bg-card p-4 rounded-xl border-[1px] border-gray-700'>
          <Text className='text-txt-primary font-semibold text-xl'>Total volume</Text>
          <Text className='text-txt-secondary'>2460 kg</Text>
        </View>
      </View>
    </ScrollView>
  );
}
