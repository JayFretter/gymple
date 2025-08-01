import EditableWorkoutExerciseList from '@/components/EditableWorkoutExerciseList';
import ModifyOngoingWorkoutPage from '@/components/ModifyOngoingWorkoutPage';
import MuscleIcon from '@/components/shared/MuscleIcon';
import GradientPressable from '@/components/shared/GradientPressable';
import LevelBar from '@/components/shared/LevelBar';
import WorkoutTimer from '@/components/shared/WorkoutTimer';
import { IMPROMPTU_WORKOUT_ID, IMPROMPTU_WORKOUT_NAME } from '@/constants/StringConstants';
import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import useOngoingWorkoutStore from '@/hooks/useOngoingWorkoutStore';
import useStatusBarStore from '@/hooks/useStatusBarStore';
import useStorage from '@/hooks/useStorage';
import useWorkoutBuilderStore from '@/hooks/useWorkoutBuilderStore';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';


export default function ViewWorkoutPage() {
  // Navigation & focus
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();

  // State
  const [workout, setWorkout] = useState<WorkoutDefinition | null>(null);
  const [exercises, setExercises] = useState<ExerciseDefinition[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Hooks
  const { fetchFromStorage } = useStorage();
  const setWorkoutBuilderExercises = useWorkoutBuilderStore(state => state.setExercises);
  const clearWorkoutBuilderState = useWorkoutBuilderStore(state => state.clearAll);
  const setWorkoutStartedTimestamp = useOngoingWorkoutStore(state => state.setWorkoutStartedTimestamp);
  const setWorkoutFinishedTimestamp = useOngoingWorkoutStore(state => state.setWorkoutFinishedTimestamp);
  const setOngoingWorkout = useOngoingWorkoutStore(state => state.setWorkout);
  const ongoingWorkoutId = useOngoingWorkoutStore(state => state.workoutId);
  const ongoingWorkoutName = useOngoingWorkoutStore(state => state.workoutName);
  const ongoingWorkoutExerciseIds = useOngoingWorkoutStore(state => state.exerciseIds);
  const completedExercises = useOngoingWorkoutStore(state => state.performanceData).map(exercise => exercise.exerciseId);
  const resetOngoingWorkoutState = useOngoingWorkoutStore(state => state.resetAll);
  const setStatusBarNode = useStatusBarStore(state => state.setNode);

  // Fetch workout and exercises on focus or change
  useEffect(() => {
    if (!isFocused) return;

    // If no workoutId param, check for ongoing workout
    if ((!params.workoutId || params.workoutId === IMPROMPTU_WORKOUT_ID) && ongoingWorkoutId) {
      // Impromptu workout or ongoing session
      setWorkout({
        id: params.workoutId ?? IMPROMPTU_WORKOUT_ID,
        title: ongoingWorkoutName ?? '',
        exerciseIds: ongoingWorkoutExerciseIds,
      });
      const allExercises = useFetchAllExercises();
      const filteredExercises = ongoingWorkoutExerciseIds
        .map(exerciseId => allExercises.find(e => e.id === exerciseId))
        .filter(Boolean) as ExerciseDefinition[];
      setExercises(filteredExercises);
    } else {
      fetchWorkout(params.workoutId as string);
    }
  }, [isFocused, ongoingWorkoutExerciseIds]);

  const handleWorkoutStarted = () => {
    if (!workout) return;
    resetOngoingWorkoutState();
    setWorkoutStartedTimestamp(Date.now());
    setOngoingWorkout(workout);
    setStatusBarNode(<WorkoutTimer />);
  };

  const fetchWorkout = (id: string) => {
    const allWorkouts = fetchFromStorage<WorkoutDefinition[]>('data_workouts');
    if (!allWorkouts) return;
    const currentWorkoutDef = allWorkouts.find(w => w.id === id);
    if (!currentWorkoutDef) return;

    setWorkout(currentWorkoutDef);
    const allExercises = useFetchAllExercises();
    const exerciseIds = ongoingWorkoutId === id ? ongoingWorkoutExerciseIds : currentWorkoutDef.exerciseIds;
    const filteredExercises = exerciseIds
      .map(exerciseId => allExercises.find(e => e.id === exerciseId))
      .filter(Boolean) as ExerciseDefinition[];
    setExercises(filteredExercises);
  };

  const toggleEditMode = () => {
    if (!isEditing) {
      setWorkoutBuilderExercises(exercises);
      setIsEditing(true);
    } else {
      clearWorkoutBuilderState();
      setIsEditing(false);
    }
  };

  const handleWorkoutEditingFinished = () => {
    setIsEditing(false);
    fetchWorkout(params.workoutId as string);
  };

  const handleWorkoutFinished = () => {
    setWorkoutFinishedTimestamp(Date.now());
    router.push('/(tabs)/workout/WorkoutCompletedPage');
  };

  const renderEditWorkoutPage = () => {
    if (ongoingWorkoutId) {
      return <ModifyOngoingWorkoutPage onDonePressed={handleWorkoutEditingFinished} />;
    }
    if (!workout) return null;
    return <EditableWorkoutExerciseList workout={workout} onSave={handleWorkoutEditingFinished} />;
  };

  const renderExerciseList = () => {
    if (exercises.length === 0) {
      return <Text className="text-txt-secondary">No exercises have been added to this workout.</Text>;
    }

    return (
      <View>
        {
          exercises.map((exercise, index) => (
            <TouchableOpacity
              key={index}
              className="bg-card flex-row items-center gap-4 p-4 rounded-lg mb-4"
              onPress={() => router.push({ pathname: '/workout/TrackExercisePage', params: { exerciseId: exercise.id } })}
            >
              <MuscleIcon muscle='tricep' size={40} />
              <View>
                <Text className="text-txt-primary text-xl">{exercise.name}</Text>
                {/* <LevelBar className='mt-2' currentLevel={exercise.experience.level} percentage={exercise.experience.percentage} /> */}
                {completedExercises.includes(exercise.id) && (
                  <View className='flex flex-row items-center gap-1 mt-2'>
                    <Text className='text-green-500 text-sm'>Completed</Text>
                    <AntDesign name="check" size={12} color="#22c55e" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        }
      </View>
    );
  };

  const renderWorkout = () => {
    if (!(workout || ongoingWorkoutId)) {
      return <Text className="text-txt-secondary text-lg">No workout found.</Text>;
    }

    if (isEditing) {
      return renderEditWorkoutPage();
    }

    return (
      <ScrollView className="bg-primary px-4">
        <TouchableOpacity
          className='mb-4 mt-4 flex flex-row items-center gap-1 justify-end'
          onPress={toggleEditMode}
        >
          <Text className='text-[#03a1fc] text-xl font-bold'>Edit</Text>
        </TouchableOpacity>
        <Text className="text-txt-primary text-4xl font-bold mb-8">
          {workout?.title ?? IMPROMPTU_WORKOUT_NAME}
        </Text>
        {(!ongoingWorkoutId || ongoingWorkoutId !== workout?.id) ? (
          <GradientPressable style='default' onPress={handleWorkoutStarted}>
            <View className='flex-row items-center justify-center gap-2 py-2'>
              <Text className="text-txt-primary text-center font-semibold">Start Workout</Text>
              <MaterialCommunityIcons name="dumbbell" size={16} color="white" />
            </View>
          </GradientPressable>
        ) : (
          <GradientPressable style='default' onPress={handleWorkoutFinished}>
            <View className='flex-row items-center justify-center gap-2 py-2'>
              <Text className="text-txt-primary text-center font-semibold">Finish Workout</Text>
              <MaterialCommunityIcons name="flag" size={16} color="white" />
            </View>
          </GradientPressable>
        )}
        <View className='mt-8'>
          <Text className="text-txt-primary text-xl font-semibold mb-4">Exercises</Text>
          {renderExerciseList()}
          {ongoingWorkoutId && (
            <View className='mt-8'>
              <Text className='text-txt-secondary mb-2'>Switching it up? Tap below to modify the workout for this session only.</Text>
              <GradientPressable className='mb-4' style='gray' onPress={toggleEditMode}>
                <View className='flex-row items-center justify-center gap-2 py-2'>
                  <Text className="text-txt-primary text-center">Modify workout</Text>
                  <AntDesign name="edit" size={14} color="white" />
                </View>
              </GradientPressable>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-primary">
      {renderWorkout()}
      {/* {ongoingWorkoutId && <ModifyOngoingWorkoutPage onDonePressed={handleWorkoutEditingFinished} />} */}
    </View>
  );
}
