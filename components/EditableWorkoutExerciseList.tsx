import useWorkoutBuilderStore from "@/hooks/useWorkoutBuilderStore";
import WorkoutDefinition from "@/interfaces/WorkoutDefinition";
import { storage } from "@/storage";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SwipeListView } from 'react-native-swipe-list-view';
import uuid from 'react-native-uuid';
import GradientPressable from "./shared/GradientPressable";
import ReorderableExerciseList from "./shared/ReorderableExerciseList";

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
    const setIsSingleExerciseMode = useWorkoutBuilderStore(state => state.setIsSingleExerciseMode);

    const listData = exercises.map((exercise, _) => ({ key: exercise.id, text: exercise.name }));


    const goToExerciseSelection = () => {
        setIsSingleExerciseMode(false);
        router.push('/workout/SelectExercisePage');
    };

    const handleDonePressed = () => {
        const newWorkoutDef: WorkoutDefinition = {
            id: workout?.id ?? uuid.v4(),
            title: title.length > 0 ? title : 'Untitled Workout',
            exerciseIds: exercises.map(e => e.id)
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
        <View className="max-h-full pb-4 bg-primary px-4 py-4">
            <GradientPressable style="red" className="ml-auto" onPress={handleDeletePressed}>
                <Text className="text-white text-center font-semibold mx-4 my-1">Delete</Text>
            </GradientPressable>
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
                    <FontAwesome6 name="arrows-up-down" size={12} color="#555555" />
                    <Text className="text-txt-tertiary">Hold and drag to reorder</Text>
                </View>
            }
            <GradientPressable className="mb-4" style="gray" onPress={goToExerciseSelection}>
                <View className="py-2 px-4 flex-row items-center justify-center gap-2">
                    <AntDesign name="plus" size={14} color="white" />
                    <Text className="text-white text-center font-semibold">Add exercise</Text>
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