import { GoalTile } from '@/components/GoalTile';
import AchievementCard from '@/components/shared/AchievementCard';
import GradientPressable from '@/components/shared/GradientPressable';
import { AchievementType } from '@/enums/achievement-type';
import useCalculateGoalPerformance from '@/hooks/useCalculateGoalPerformance';
import useCalculateVolume from '@/hooks/useCalculateVolume';
import useOngoingWorkoutStore from '@/hooks/useOngoingWorkoutStore';
import useStatusBarStore from '@/hooks/useStatusBarStore';
import useStorage from '@/hooks/useStorage';
import useUpdateCurrentWorkoutAchievements from '@/hooks/useUpdateCurrentWorkoutAchievements';
import useUpdateExerciseMaxes from '@/hooks/useUpdateExerciseMaxes';
import useUpsertGoal from '@/hooks/useUpsertGoal';
import Achievement from '@/interfaces/Achievement';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import ExercisePerformanceData from '@/interfaces/ExercisePerformanceData';
import GoalDefinition from '@/interfaces/GoalDefinition';
import { SessionDefinition } from '@/interfaces/SessionDefinition';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import uuid from 'react-native-uuid';
import { router } from 'expo-router';
import { addStreakDay } from '@/utils/workoutStreak';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { WeightUnit } from '@/enums/weight-unit';

const testAchievements: Achievement[] = [
  {
    sessionId: null,
    exerciseId: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    type: AchievementType.OneRepMax,
    value: {
      weight: 100
    },
    previousValue: {
      weight: 90
    },
    timestamp: Date.now()
  },
  {
    sessionId: null,
    exerciseId: 'a9d4e5f6-a7b8-9c0d-1e2f-a44b1ccd2e8f',
    type: AchievementType.EstimatedOneRepMax,
    value: {
      weight: 105
    },
    previousValue: {
      weight: 95
    },
    timestamp: Date.now()
  },
  {
    sessionId: null,
    exerciseId: 'a4b8c9d0-e1f2-3a4b-5c6d-7e8f9g0h1i2j',
    type: AchievementType.ExerciseVolume,
    value: {
      weight: 200
    },
    previousValue: {
      weight: 180
    },
    timestamp: Date.now()
  }
];

export default function WorkoutCompletedPage() {

  const achievements = useOngoingWorkoutStore(state => state.achievements);
  // const achievements = testAchievements;

  const ongoingWorkoutName = useOngoingWorkoutStore(state => state.workoutName);
  const ongoingWorkoutId = useOngoingWorkoutStore(state => state.workoutId);
  const completedGoals = useOngoingWorkoutStore(state => state.completedGoals);
  const addCompletedGoal = useOngoingWorkoutStore(state => state.addCompletedGoal);
  const performanceData = useOngoingWorkoutStore(state => state.performanceData);
  const workoutStartedTimestamp = useOngoingWorkoutStore(state => state.workoutStartedTimestamp);
  const resetCurrentWorkout = useOngoingWorkoutStore(state => state.resetAll);
  const ongoingSessionId = useOngoingWorkoutStore(state => state.sessionId);
  const updateCurrentWorkoutAchievements = useUpdateCurrentWorkoutAchievements();

  const removeStatusBarNode = useStatusBarStore(state => state.removeNode);

  const [allExercises, setAllExercises] = useState<ExerciseDefinition[]>([]);
  const { fetchFromStorage, setInStorage } = useStorage();

  const [exerciseIdToVolumeMap, setExerciseIdToVolumeMap] = useState(new Map<string, number>());

  const calculateVolume = useCalculateVolume();
  const updateExerciseMaxes = useUpdateExerciseMaxes();

  const { calculateGoalPercentageFromPerformance } = useCalculateGoalPerformance();
  const upsertGoal = useUpsertGoal();

  useEffect(() => {
    const exerciseList = fetchFromStorage<ExerciseDefinition[]>('data_exercises') || [];

    setAllExercises(exerciseList);
    savePerformanceData();
    saveSession(exerciseList);
    addStreakDay('workout');
  }, [performanceData]);

  const savePerformanceData = () => {
    const exerciseIdToVolume = new Map<string, number>();
    const currentGoals = fetchFromStorage<GoalDefinition[]>('data_goals') ?? [];

    performanceData.forEach(performance => {      
      exerciseIdToVolume.set(performance.exerciseId, calculateVolume(performance.sets, WeightUnit.KG));
      updateCurrentWorkoutAchievements(performance);

      const relatedGoals = currentGoals.filter(g => g.associatedExerciseId === performance.exerciseId);
      relatedGoals.forEach(g => {
        updateGoalPerformance(g, performance);
      })

      const existingData = fetchFromStorage<ExercisePerformanceData[]>(`data_exercise_${performance.exerciseId}`) ?? [];
      existingData.push(performance);
      setInStorage(`data_exercise_${performance.exerciseId}`, existingData);

    });
    setExerciseIdToVolumeMap(exerciseIdToVolume);
  }

  const saveSession = (exerciseList: ExerciseDefinition[]) => {
    if (!ongoingWorkoutId || !ongoingSessionId || !ongoingWorkoutName || !workoutStartedTimestamp) {
      return;
    }

    // Calculate total volume for the session
    let totalVolume = 0;
    performanceData.forEach(performance => {
      totalVolume += calculateVolume(performance.sets, WeightUnit.KG);
    });

    const session: SessionDefinition = {
      id: ongoingSessionId,
      timestamp: Date.now(),
      workoutId: ongoingWorkoutId,
      workoutName: ongoingWorkoutName,
      duration: Date.now() - workoutStartedTimestamp,
      exercises: performanceData.map(performance => ({
        exerciseId: performance.exerciseId,
        exerciseName: exerciseList.find(ex => ex.id === performance.exerciseId)?.name || 'Unknown Exercise'
      })),
      volumeInKg: totalVolume
    };
    
    setInStorage('data_sessions', [...(fetchFromStorage<SessionDefinition[]>('data_sessions') || []), session]);
  }

  const updateGoalPerformance = (goal: GoalDefinition, performance: ExercisePerformanceData) => {
    if (goal.percentage >= 100) {
      return;
    }

    const newGoalPercentage = calculateGoalPercentageFromPerformance(goal, performance);
    if (newGoalPercentage > goal.percentage) {
      goal.percentage = newGoalPercentage;
      upsertGoal(goal);

      if (newGoalPercentage >= 100) {
        addCompletedGoal(goal);
      }
    }
  }

  const getExerciseNameFromId = (exerciseId: string) => {
    const exercise = allExercises.find(ex => ex.id === exerciseId);
    return exercise ? exercise.name : 'Unknown Exercise';
  }

  const getExerciseVolumeFromId = (exerciseId: string) => {
    const volume = exerciseIdToVolumeMap.get(exerciseId);
    return volume !== undefined ? `${volume} kg` : 'Unknown Volume';
  }

  const getTotalWorkoutVolume = () => {
    if (exerciseIdToVolumeMap.size === 0) return 0;

    let totalVolume = 0;
    exerciseIdToVolumeMap.forEach((value, _) => totalVolume += value)

    return totalVolume;
  }

  const getFormattedWorkoutDuration = () => {
    if (!workoutStartedTimestamp) return '0m 0s';

    const elapsedTime = Date.now() - workoutStartedTimestamp;

    const totalSeconds = Math.floor(elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  const handleGoToDashboard = () => {
    const allAchievements = fetchFromStorage<Achievement[]>('data_achievements') || [];
    setInStorage('data_achievements', [...allAchievements, ...achievements]);

    performanceData.forEach(performance => {
      updateExerciseMaxes(performance);
    })

    resetCurrentWorkout();
    removeStatusBarNode();
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
        <Text className='text-txt-primary text-4xl text-center font-semibold mb-1'>{ongoingWorkoutName}</Text>
        <View className='flex-row items-center gap-2 mb-12 mx-auto'>
          <Text className='text-[#068bec] text-xl'>Workout complete</Text>
          <SimpleLineIcons name="check" size={14} color="#068bec" />
        </View>
        {achievements.length > 0 &&
          (
            <View>
              <Text className='text-txt-secondary text-xl text-center mb-4'>Achievements earned:</Text>
              <View className="mb-8 mx-auto">
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  {
                    achievements.map((achievement, index) => (
                      <AchievementCard key={index} className='mr-4' achievement={achievement} />
                    ))}
                </ScrollView>
              </View>
            </View>
          )
        }

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
            <Text className="text-txt-secondary">No goals completed in this session.</Text>
          )}
        </View>

        <Text className='text-txt-secondary text-xl text-center mb-4'>Exercises completed:</Text>
        <View className="mb-8 mx-auto">
          {performanceData.length > 0 ? (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {
                performanceData.map((performance, index) => (
                  <View key={index} className='bg-card rounded-xl p-4 flex mr-2 border-[1px] border-gray-700'>
                    <Text className='text-txt-primary font-semibold text-xl mb-2'>{getExerciseNameFromId(performance.exerciseId)}</Text>
                    <Text className='text-txt-secondary'>Sets: {performance.sets.length}</Text>
                    <Text className='text-txt-secondary'>Total reps: {performance.sets.reduce((acc, curr) => acc + curr.reps, 0)}</Text>
                    <Text className='text-txt-secondary'>Total volume: {getExerciseVolumeFromId(performance.exerciseId)}</Text>
                  </View>
                ))}
            </ScrollView>

          ) : (
            <Text className="text-txt-secondary">No exercises completed in this session.</Text>
          )}
        </View>

        <Text className='text-txt-secondary text-xl text-center mb-4'>Summary:</Text>
        <View className='flex-row gap-2 mx-auto'>
          <View className='bg-card p-4 rounded-xl border-[1px] border-gray-700'>
            <Text className='text-txt-primary font-semibold text-xl'>Duration</Text>
            <Text className='text-txt-secondary'>{getFormattedWorkoutDuration()}</Text>
          </View>
          <View className='bg-card p-4 rounded-xl border-[1px] border-gray-700'>
            <Text className='text-txt-primary font-semibold text-xl'>Total volume</Text>
            <Text className='text-txt-secondary'>{getTotalWorkoutVolume()} kg</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
