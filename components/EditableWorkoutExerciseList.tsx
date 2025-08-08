import useWorkoutBuilderStore, { ExerciseWithSets } from "@/hooks/useWorkoutBuilderStore";
import WorkoutDefinition, { ExerciseInWorkout } from "@/interfaces/WorkoutDefinition";
import { storage } from "@/storage";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SwipeListView } from 'react-native-swipe-list-view';
import uuid from 'react-native-uuid';
import GradientPressable from "./shared/GradientPressable";
import ReorderableExerciseList from "./shared/ReorderableExerciseList";
import useThemeColours from "@/hooks/useThemeColours";

interface EditableWorkoutExerciseListProps {
  workout?: WorkoutDefinition;
  onSave: (workoutId: string) => void;
  focusOnTitle?: boolean;
}

const EditableWorkoutExerciseList = ({ workout, onSave: onDonePressed, focusOnTitle }: EditableWorkoutExerciseListProps) => {
  const [title, setTitle] = useState<string>(workout?.title ?? '');

  const exercises = useWorkoutBuilderStore(state => state.exercises);
  const setExercises = useWorkoutBuilderStore(state => state.setExercises);
  const removeExercise = useWorkoutBuilderStore(state => state.removeExercise);
  const updateSets = useWorkoutBuilderStore(state => state.updateSets);
  const setIsSingleExerciseMode = useWorkoutBuilderStore(state => state.setIsSingleExerciseMode);

  const themeColour = useThemeColours();
  const navigation = useNavigation();




  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          className='active:opacity-75 disabled:opacity-35'
          onPress={handleDeletePressed}
          disabled={!workout}
        >
          <Text className="text-red-500 font-semibold text-lg">Delete Workout</Text>
        </Pressable>
      )
    })
  }, [navigation]);


  const goToExerciseSelection = () => {
    setIsSingleExerciseMode(false);
    router.push('/workout/SelectExercisePage');
  };

  const handleDonePressed = () => {
    // Store sets per exercise in the workout definition
    const newWorkoutDef: WorkoutDefinition = {
      id: workout?.id ?? uuid.v4(),
      title: title.length > 0 ? title : 'Untitled Workout',
      exercises: exercises.map(e => ({ id: e.exercise.id, sets: e.sets })),
    };

    const existingWorkouts = storage.getString('data_workouts');
    const workouts: WorkoutDefinition[] = existingWorkouts ? JSON.parse(existingWorkouts) : [];

    const newWorkouts = workouts.filter(w => w.id !== newWorkoutDef.id);
    newWorkouts.push(newWorkoutDef);
    storage.set('data_workouts', JSON.stringify(newWorkouts));

    onDonePressed(newWorkoutDef.id);
  }

  const handleDeletePressed = () => {
    const existingWorkouts = storage.getString('data_workouts');
    const workouts: WorkoutDefinition[] = existingWorkouts ? JSON.parse(existingWorkouts) : [];

    const newWorkouts = workouts.filter(w => w.id !== workout?.id);
    storage.set('data_workouts', JSON.stringify(newWorkouts));

    router.back();
  }

  const deleteExerciseFromBuilder = (exerciseId: string) => {
    removeExercise(exerciseId);
  }

  const handleSetChange = (exerciseId: string, sets: number) => {
    updateSets(exerciseId, sets);
  }

  const renderExerciseList = () => {
    if (exercises.length === 0) {
      return (
        <Text className="text-txt-secondary text-center mb-8">No exercises added yet.</Text>
      );
    }

    return (
      <View>
        <View className="flex-row justify-between mx-4">
          <Text className="text-txt-secondary text-sm mb-2">Exercise</Text>
          <Text className="text-txt-secondary text-sm mb-2">Sets</Text>
        </View>
        <ReorderableExerciseList
          exercises={exercises}
          onDelete={deleteExerciseFromBuilder}
          onReorder={setExercises}
          onSetChange={handleSetChange}
        />
      </View>
    );
  }

  return (
    <View className="max-h-full pb-4 px-4 py-4">
      <TextInput
        className="bg-card text-txt-primary p-2 mt-4 mb-8 rounded text-2xl font-semibold"
        placeholder={workout?.title ?? 'Workout title'}
        placeholderTextColor="#777"
        value={title}
        onChangeText={setTitle}
        autoFocus={focusOnTitle}
      />
      {renderExerciseList()}
      {
        exercises.length > 0 &&
        <View className="flex flex-row items-center justify-center gap-2 mb-4">
          {/* <FontAwesome6 name="arrows-up-down" size={12} color="#555555" /> */}
          <Text className="text-txt-tertiary">Hold and drag to reorder, swipe to delete</Text>
        </View>
      }
      <GradientPressable className="mb-4" style="gray" onPress={goToExerciseSelection}>
        <View className="py-2 px-4 flex-row items-center justify-center gap-2">
          <AntDesign name="plus" size={14} color={themeColour('txt-primary')} />
          <Text className="text-txt-primary text-center font-semibold">Add exercise</Text>
        </View>
      </GradientPressable>

      <GradientPressable style="default" onPress={handleDonePressed}>
        <View className="py-2 px-4 flex-row items-center justify-center gap-2">
          <Text className="text-white text-center font-semibold">Save workout</Text>
        </View>
      </GradientPressable>
    </View>
  )
};

export default EditableWorkoutExerciseList;