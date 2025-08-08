import EditableWorkoutExerciseList from '@/components/EditableWorkoutExerciseList';
import ModifyOngoingWorkoutPage from '@/components/ModifyOngoingWorkoutPage';
import BgView from '@/components/shared/BgView';
import GradientPressable from '@/components/shared/GradientPressable';
import MuscleIcon from '@/components/shared/MuscleIcon';
import PopUp from '@/components/shared/PopUp';
import WorkoutTimer from '@/components/shared/WorkoutTimer';
import WorkoutPerformanceChart from '@/components/WorkoutPerformanceChart';
import { IMPROMPTU_WORKOUT_ID, IMPROMPTU_WORKOUT_NAME } from '@/constants/StringConstants';
import { ExerciseCategory } from '@/enums/exercise-category';
import useFetchAllExercises from '@/hooks/useFetchAllExercises';
import useOngoingWorkoutManager from '@/hooks/useOngoingWorkoutManager';
import useStatusBarStore from '@/hooks/useStatusBarStore';
import useStorage from '@/hooks/useStorage';
import useThemeColours from '@/hooks/useThemeColours';
import useWorkoutBuilderStore from '@/hooks/useWorkoutBuilderStore';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';


export default function ViewWorkoutPage() {
  // Navigation & focus
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();

  // State
  const [workout, setWorkout] = useState<WorkoutDefinition | null>(null);
  const [exercises, setExercises] = useState<ExerciseDefinition[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCancelWorkoutPopUpVisible, setIsCancelWorkoutPopUpVisible] = useState(false);

  // Hooks
  const { fetchFromStorage } = useStorage();
  const setWorkoutBuilderExercises = useWorkoutBuilderStore(state => state.setExercises);
  const clearWorkoutBuilderState = useWorkoutBuilderStore(state => state.clearAll);
  const setStatusBarNode = useStatusBarStore(state => state.setNode);
  const removeStatusBarNode = useStatusBarStore(state => state.removeNode);
  const workoutManager = useOngoingWorkoutManager();
  const themeColour = useThemeColours();
  const navigation = useNavigation();

  useEffect(() => {
    if (workoutManager.ongoingWorkoutId || isEditing) {
      // navigation.setOptions({ headerRight: () => null })
      return;
    }

    navigation.setOptions({
      headerRight: () => (
        <Pressable
          className='active:opacity-75 disabled:opacity-35'
          onPress={toggleEditMode}
          disabled={!workout}
        >
          <Text className="text-blue-500 font-semibold text-lg">Edit Workout</Text>
        </Pressable>
      )
    })
  }, [navigation, exercises, isEditing, workoutManager.ongoingWorkoutId]);

  // Fetch workout and exercises on focus or change
  useEffect(() => {
    if (!isFocused) return;

    // If no workoutId param, check for ongoing workout
    if ((!params.workoutId || params.workoutId === IMPROMPTU_WORKOUT_ID) && workoutManager.ongoingWorkoutId) {
      setWorkout({
        id: params.workoutId ?? IMPROMPTU_WORKOUT_ID,
        title: workoutManager.ongoingWorkoutName ?? '',
        exerciseIds: workoutManager.ongoingWorkoutExerciseIds,
      });
      const allExercises = useFetchAllExercises();
      const filteredExercises = workoutManager.ongoingWorkoutExerciseIds
        .map(exerciseId => allExercises.find(e => e.id === exerciseId))
        .filter(Boolean) as ExerciseDefinition[];
      setExercises(filteredExercises);

      // if (filteredExercises.length === 0) {
      //   // clearWorkoutBuilderState();
      //   setIsEditing(true);
      // }
    } else {
      fetchWorkout(params.workoutId as string);
    }
  }, [isFocused, workoutManager.ongoingWorkoutExerciseIds]);

  const handleWorkoutStarted = () => {
    if (!workout) return;
    workoutManager.startWorkout(workout);
    setStatusBarNode(<WorkoutTimer />);
  };

  const fetchWorkout = (id: string) => {
    const allWorkouts = fetchFromStorage<WorkoutDefinition[]>('data_workouts');
    if (!allWorkouts) return;
    const currentWorkoutDef = allWorkouts.find(w => w.id === id);
    if (!currentWorkoutDef) return;

    setWorkout(currentWorkoutDef);
    const allExercises = useFetchAllExercises();
    const exerciseIds = workoutManager.ongoingWorkoutId === id ? workoutManager.ongoingWorkoutExerciseIds : currentWorkoutDef.exerciseIds;
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
    workoutManager.endWorkout();
    removeStatusBarNode();
    router.push('/(tabs)/workout/WorkoutCompletedPage');
  };

  const handleWorkoutCancelled = () => {
    setIsCancelWorkoutPopUpVisible(false);
    workoutManager.resetWorkout();
    removeStatusBarNode();
  };

  const renderEditWorkoutPage = () => {
    if (workoutManager.ongoingWorkoutId) {
      return <ModifyOngoingWorkoutPage onDonePressed={handleWorkoutEditingFinished} />;
    }
    if (!workout) return null;
    return <EditableWorkoutExerciseList workout={workout} onSave={handleWorkoutEditingFinished} />;
  };

  const handleExercisePressed = (exercise: ExerciseDefinition) => {
    if (exercise.categories.includes(ExerciseCategory.Cardio)) {
      router.push({ pathname: '/workout/TrackCardioPage', params: { exerciseId: exercise.id } })
    } else {
      router.push({ pathname: '/workout/TrackExercisePage', params: { exerciseId: exercise.id } })
    }
  }

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
              className="bg-card flex-row items-center gap-4 px-4 py-2 rounded-lg mb-4 overflow-hidden"
              onPress={() => handleExercisePressed(exercise)}
            >
              <MuscleIcon category={exercise.categories[0]} size={35} />
              <View>
                <Text className="text-txt-primary text-xl">{exercise.name}</Text>
                {workoutManager.ongoingWorkoutId && (workoutManager.completedExercises.includes(exercise.id) ? (
                  <View className='flex flex-row items-center gap-1'>
                    <Text className='text-green-500 text-sm'>Completed</Text>
                    <MaterialCommunityIcons name="checkbox-marked-outline" size={12} color="#22c55e" />
                  </View>
                ) : (
                  <View className='flex flex-row items-center gap-1'>
                    <Text className='text-txt-secondary text-sm'>Not completed</Text>
                    <MaterialCommunityIcons name="checkbox-blank-outline" size={12} color="#aaaaaa" />
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))
        }
      </View>
    );
  };

  const renderWorkout = () => {
    if (!(workout || workoutManager.ongoingWorkoutId)) {
      return <Text className="text-txt-secondary text-lg">No workout found.</Text>;
    }

    if (isEditing) {
      return renderEditWorkoutPage();
    }

    return (
      <BgView>
        <PopUp
          visible={isCancelWorkoutPopUpVisible}
          onClose={handleWorkoutCancelled}
          onCancel={() => setIsCancelWorkoutPopUpVisible(false)}
          disallowCloseOnBackgroundPress
          closeButtonText="Cancel Workout"
          cancelButtonText='Back'
        >
          <Text className='text-txt-primary text-center font-bold text-2xl'>Cancel Workout</Text>
          <Text className='text-txt-secondary mt-4 mb-4 text-center'>
            Are you sure you want to stop the workout in progress? Any progress will be lost.
          </Text>
        </PopUp>
        <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
          <Text className="text-txt-primary text-4xl font-bold mb-8 mt-4">
            {workout?.title ?? IMPROMPTU_WORKOUT_NAME}
          </Text>
          {workout?.id && workout.id !== IMPROMPTU_WORKOUT_ID && 
            <WorkoutPerformanceChart className="mb-8" workoutId={workout.id} />
          }
          {(!workoutManager.ongoingWorkoutId || workoutManager.ongoingWorkoutId !== workout?.id) ? (
            <GradientPressable style='default' onPress={handleWorkoutStarted}>
              <View className='flex-row items-center justify-center gap-2 py-2'>
                <Text className="text-white text-center font-semibold">Start Workout</Text>
                <MaterialCommunityIcons name="dumbbell" size={16} color="white" />
              </View>
            </GradientPressable>
          ) : (
            <View className='flex-row items-center justify-between gap-4'>
              <GradientPressable className='flex-grow' style='gray' onPress={() => setIsCancelWorkoutPopUpVisible(true)}>
                <View className='flex-row items-center justify-center gap-2 py-2 px-4'>
                  <Text className="text-txt-primary text-center font-semibold">Cancel Workout</Text>
                  <MaterialCommunityIcons name="cancel" size={16} color={themeColour('txt-primary')} />
                </View>
              </GradientPressable>
              <GradientPressable
                className='flex-grow'
                style='default'
                onPress={handleWorkoutFinished}
                disabled={workoutManager.completedExercises.length === 0}
              >
                <View className='flex-row items-center justify-center gap-2 py-2 px-4'>
                  <Text className="text-white text-center font-semibold">Finish Workout</Text>
                  <MaterialCommunityIcons name="flag-checkered" size={16} color="white" />
                </View>
              </GradientPressable>
            </View>
          )}
          <View className='mt-8'>
            <Text className="text-txt-primary text-xl font-semibold mb-4">Exercises</Text>
            {renderExerciseList()}
            {workoutManager.ongoingWorkoutId && (
              <View className='mt-8'>
                <Text className='text-txt-secondary mb-2'>Switching it up? Tap below to modify the workout for this session only.</Text>
                <GradientPressable className='mb-4' style='subtleHighlight' onPress={toggleEditMode}>
                  <View className='flex-row items-center justify-center gap-2 py-2'>
                    <Text className="text-txt-primary text-center">Modify workout</Text>
                    <AntDesign name="edit" size={14} color={themeColour('txt-primary')} />
                  </View>
                </GradientPressable>
              </View>
            )}
          </View>
        </ScrollView>
      </BgView>
    );
  };

  return (
    <View className="flex-1 bg-primary">
      {renderWorkout()}
    </View>
  );
}
