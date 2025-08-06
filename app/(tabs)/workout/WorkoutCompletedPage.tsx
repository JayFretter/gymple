import { GoalTile } from '@/components/GoalTile';
import AchievementCard from '@/components/shared/AchievementCard';
import GradientPressable from '@/components/shared/GradientPressable';
import useOngoingWorkoutManager from '@/hooks/useOngoingWorkoutManager';
import useStorage from '@/hooks/useStorage';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';


export default function WorkoutCompletedPage() {
  const [allExercises, setAllExercises] = useState<ExerciseDefinition[]>([]);
  const { fetchFromStorage } = useStorage();
  const [exerciseIdToVolumeMap, setExerciseIdToVolumeMap] = useState(new Map<string, number>());

  const workoutManager = useOngoingWorkoutManager();
  

  useEffect(() => {
    const exerciseList = fetchFromStorage<ExerciseDefinition[]>('data_exercises') || [];
    setAllExercises(exerciseList);
    setExerciseIdToVolumeMap(workoutManager.generateExerciseIdToVolumeMap());
  }, []);

  const getExerciseNameFromId = (exerciseId: string) => {
    const exercise = allExercises.find(ex => ex.id === exerciseId);
    return exercise ? exercise.name : 'Unknown Exercise';
  }

  const getExerciseVolumeFromId = (exerciseId: string) => {
    console.log('trying to get volume for exerciseId:', exerciseId, exerciseIdToVolumeMap);
    const volume = exerciseIdToVolumeMap.get(exerciseId);
    return volume !== undefined ? `${volume} kg` : 'Unknown Volume'; // TODO: use user preferences for unit
  }

  const getTotalWorkoutVolume = () => {
    if (exerciseIdToVolumeMap.size === 0) return 0;

    let totalVolume = 0;
    exerciseIdToVolumeMap.forEach((value, _) => totalVolume += value)

    return totalVolume;
  }

  const getFormattedWorkoutDuration = () => {
    if (!workoutManager.ongoingWorkoutStartedTimestamp) return '0m 0s';

    const elapsedTime = Date.now() - workoutManager.ongoingWorkoutStartedTimestamp;

    const totalSeconds = Math.floor(elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  const handleGoToDashboard = () => {
    workoutManager.resetWorkout();
    router.dismissAll();
    router.push('/(tabs)/dashboard');
  }

  return (
    <View className='flex-1'>
      <View className='flex-row w-full items-center justify-center absolute bottom-4 z-10'>
        <GradientPressable
          className='w-3/4'
          style='default'
          onPress={handleGoToDashboard}
        >
          <Text className="text-white text-lg text-center my-2">Go to Dashboard</Text>
        </GradientPressable>
      </View>
      <ScrollView className="bg-primary px-4 flex-1" contentContainerStyle={{ paddingTop: 32, paddingBottom: 128 }}>
        <Text className='text-txt-primary text-4xl text-center font-semibold mb-1'>{workoutManager.ongoingWorkoutName}</Text>
        <View className='flex-row items-center gap-2 mb-12 mx-auto'>
          <Text className='text-[#068bec] text-xl'>Workout complete</Text>
          <SimpleLineIcons name="check" size={14} color="#068bec" />
        </View>
        {workoutManager.achievements.length > 0 &&
          (
            <View>
              <Text className='text-txt-secondary text-xl text-center mb-4'>Achievements earned:</Text>
              <View className="mb-8 mx-auto">
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  {
                    workoutManager.achievements.map((achievement, index) => (
                      <AchievementCard key={index} className='mr-4' achievement={achievement} />
                    ))}
                </ScrollView>
              </View>
            </View>
          )
        }

        <Text className='text-txt-secondary text-xl text-center mb-4'>Goals completed:</Text>
        <View className="mb-8 mx-auto">
          {workoutManager.completedGoals.length > 0 ? (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {
                workoutManager.completedGoals.map((goal, index) => (
                  <GoalTile key={index} goal={goal} />
                ))}
            </ScrollView>

          ) : (
            <Text className="text-txt-secondary">No goals completed in this session.</Text>
          )}
        </View>

        <Text className='text-txt-secondary text-xl text-center mb-4'>Exercises completed:</Text>
        <View className="mb-8 mx-auto">
          {workoutManager.performanceData.length > 0 ? (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {
                workoutManager.performanceData.map((performance, index) => (
                  performance.sets.every(s => s.type === 'weight') ?
                  <View key={index} className='bg-card rounded-xl p-4 flex mr-2 border-[1px] border-tertiary'>
                    <Text className='text-txt-primary font-semibold text-xl mb-2'>{getExerciseNameFromId(performance.exerciseId)}</Text>
                    <Text className='text-txt-secondary'>Sets: {performance.sets.length}</Text>
                    <Text className='text-txt-secondary'>Total reps: {performance.sets.reduce((acc, curr) => acc + curr.reps, 0)}</Text>
                    <Text className='text-txt-secondary'>Total volume: {getExerciseVolumeFromId(performance.exerciseId)}</Text>
                  </View> :
                  performance.sets.every(s => s.type === 'distance') &&
                  <View key={index} className='bg-card rounded-xl p-4 flex mr-2 border-[1px] border-tertiary'>
                    <Text className='text-txt-primary font-semibold text-xl mb-2'>{getExerciseNameFromId(performance.exerciseId)}</Text>
                    <Text className='text-txt-secondary'>Sets: {performance.sets.length}</Text>
                    <Text className='text-txt-secondary'>Total distance: {performance.sets.reduce((acc, curr) => acc + curr.distance, 0)} {performance.sets[0].distanceUnit}</Text>
                  </View>
                ))}
            </ScrollView>

          ) : (
            <Text className="text-txt-secondary">No exercises completed in this session.</Text>
          )}
        </View>

        <Text className='text-txt-secondary text-xl text-center mb-4'>Summary:</Text>
        <View className='flex-row gap-2 mx-auto'>
          <View className='bg-card p-4 rounded-xl border-[1px] border-tertiary'>
            <Text className='text-txt-primary font-semibold text-xl'>Duration</Text>
            <Text className='text-txt-secondary'>{getFormattedWorkoutDuration()}</Text>
          </View>
          <View className='bg-card p-4 rounded-xl border-[1px] border-tertiary'>
            <Text className='text-txt-primary font-semibold text-xl'>Total volume</Text>
            <Text className='text-txt-secondary'>{getTotalWorkoutVolume()} kg</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
