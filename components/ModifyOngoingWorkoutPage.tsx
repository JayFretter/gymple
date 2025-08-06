import useOngoingWorkoutStore from "@/hooks/useOngoingWorkoutStore";
import useWorkoutBuilderStore from "@/hooks/useWorkoutBuilderStore";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SwipeListView } from 'react-native-swipe-list-view';
import GradientPressable from "./shared/GradientPressable";
import ReorderableExerciseList from "./shared/ReorderableExerciseList";
import useThemeColours from "@/hooks/useThemeColours";

interface ModifyOngoingWorkoutPageProps {
  onDonePressed?: () => void;
}

export default function ModifyOngoingWorkoutPage({ onDonePressed }: ModifyOngoingWorkoutPageProps) {
  const ongoingWorkoutName = useOngoingWorkoutStore(state => state.workoutName);

  const exercises = useWorkoutBuilderStore(state => state.exercises);
  const setExercises = useWorkoutBuilderStore(state => state.setExercises);
  const removeExercise = useWorkoutBuilderStore(state => state.removeExercise);
  const setIsSingleExerciseMode = useWorkoutBuilderStore(state => state.setIsSingleExerciseMode);

  const themeColour = useThemeColours();

  const setOngoingWorkoutExerciseIds = useOngoingWorkoutStore(state => state.setExerciseIds);

  const listData = exercises.map((exercise, _) => ({ key: exercise.id, text: exercise.name }));

  const goToExerciseSelection = () => {
    setIsSingleExerciseMode(false);
    router.push('/workout/SelectExercisePage');
  };

  const deleteExerciseFromBuilder = (exerciseId: string) => {
    removeExercise(exerciseId);
  }

  const saveOngoingWorkoutExercises = () => {
    setOngoingWorkoutExerciseIds(exercises.map(e => e.id));
    if (onDonePressed) {
      onDonePressed();
    }
  }

  const renderExerciseList = () => {
    if (exercises.length === 0) {
      return (
        <Text className="text-txt-secondary text-center mb-8">No exercises added yet.</Text>
      );
    }

    return (
      <ReorderableExerciseList
        exercises={exercises}
        onDelete={deleteExerciseFromBuilder}
        onReorder={setExercises}
      />
    );
  }

  return (
    <View className="max-h-full pb-4 bg-primary p-4">
      <Text className="text-txt-primary text-4xl font-bold mb-8">{ongoingWorkoutName}</Text>
      {renderExerciseList()}
      {
        exercises.length > 0 &&
        <View className="flex flex-row items-center justify-center gap-2 mt-4 mb-4">
          <MaterialIcons name="swipe-left" size={18} color="#9ca3af" />
          <Text className="text-txt-secondary">Swipe to delete an exercise</Text>
        </View>
      }
      <GradientPressable className="mb-4" style="gray" onPress={goToExerciseSelection}>
        <View className="py-2 px-4 flex-row items-center justify-center gap-2">
          <AntDesign name="plus" size={14} color={themeColour('txt-primary')} />
          <Text className="text-txt-primary text-center font-semibold">Add exercise</Text>
        </View>
      </GradientPressable>

      <GradientPressable style="default" onPress={saveOngoingWorkoutExercises}>
        <View className="py-2 px-4 flex-row items-center justify-center gap-2">
          {/* <AntDesign name="save" size={14} color="white" /> */}
          <Text className="text-white text-center font-semibold">Done</Text>
        </View>
      </GradientPressable>
    </View>
  )
};