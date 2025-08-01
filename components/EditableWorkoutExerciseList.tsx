import useWorkoutBuilderStore from "@/hooks/useWorkoutBuilderStore";
import WorkoutDefinition from "@/interfaces/WorkoutDefinition";
import { storage } from "@/storage";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SwipeListView } from 'react-native-swipe-list-view';
import uuid from 'react-native-uuid';
import GradientPressable from "./shared/GradientPressable";

interface EditableWorkoutExerciseListProps {
    workout?: WorkoutDefinition;
    onSave: (workoutId: string) => void;
    focusOnTitle?: boolean;
}

const EditableWorkoutExerciseList = ({ workout, onSave: onDonePressed, focusOnTitle }: EditableWorkoutExerciseListProps) => {
    const [title, setTitle] = useState<string>(workout?.title ?? '');

    const exercises = useWorkoutBuilderStore(state => state.exercises);
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
            <SwipeListView
                showsVerticalScrollIndicator={false}
                disableRightSwipe
                onEndReachedThreshold={0.3}
                data={listData}
                renderItem={(data) => (
                    <View
                        className="bg-card p-4 rounded-lg"
                    >
                        <Text className="text-txt-primary text-xl">{data.item.text}</Text>
                    </View>
                )}
                renderHiddenItem={(data) => (
                    <View className="bg-red-600 h-full flex flex-row items-center justify-end rounded-lg">
                        <TouchableOpacity className="h-full w-1/4 flex justify-center pr-4" onPress={() => deleteExerciseFromBuilder(data.item.key)}>
                            <Text className='text-white text-right'>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ItemSeparatorComponent={() => <View className='h-4' />}
                leftOpenValue={0}
                rightOpenValue={-75}
                recalculateHiddenLayout={true}
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
                <View className="flex flex-row items-center justify-center gap-1 mt-2 mb-4">
                    <MaterialIcons name="chevron-left" size={18} color="#9ca3af" />
                    <Text className="text-txt-secondary">Swipe to remove an exercise</Text>
                </View>
            }
            <GradientPressable className="mb-4" style="default" onPress={goToExerciseSelection}>
                <View className="py-2 px-4 flex-row items-center justify-center gap-2">
                    <AntDesign name="plus" size={14} color="white" />
                    <Text className="text-white text-center font-semibold">Add exercise</Text>
                </View>
            </GradientPressable>

            <GradientPressable style="green" onPress={handleDonePressed}>
                <View className="py-2 px-4 flex-row items-center justify-center gap-2">
                    {/* <AntDesign name="save" size={14} color="white" /> */}
                    <Text className="text-white text-center font-semibold">Save workout</Text>
                </View>
            </GradientPressable>
        </View>
    )
};

export default EditableWorkoutExerciseList;