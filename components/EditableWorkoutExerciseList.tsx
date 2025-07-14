import useWorkoutBuilderStore from "@/hooks/useWorkoutBuilderStore";
import WorkoutDefinition from "@/interfaces/WorkoutDefinition";
import WorkoutPageItem from "@/interfaces/WorkoutPageItem";
import { storage } from "@/storage";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { SwipeListView } from 'react-native-swipe-list-view';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from "react";
import uuid from 'react-native-uuid';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface EditableWorkoutExerciseListProps {
    workout?: WorkoutPageItem;
    onDonePressed: () => void;
}

const EditableWorkoutExerciseList = ({ workout, onDonePressed }: EditableWorkoutExerciseListProps) => {
    const [title, setTitle] = useState<string>(workout?.title ?? '');

    const exercises = useWorkoutBuilderStore(state => state.exercises);
    const removeExercise = useWorkoutBuilderStore(state => state.removeExercise);

    const listData = exercises.map((exercise, _) => ({ key: exercise.id, text: exercise.name }));

    const goToExerciseSelection = () => {
        router.push('/(exercises)/SelectExercisePage');
    };

    const handleDonePressed = () => {
        const newWorkoutDef: WorkoutDefinition = {
            id: workout?.id ?? uuid.v4(),
            title,
            exerciseIds: exercises.map(e => e.id)
        };

        const existingWorkouts = storage.getString('data_workouts');
        const workouts: WorkoutDefinition[] = existingWorkouts ? JSON.parse(existingWorkouts) : [];

        const newWorkouts = workouts.filter(w => w.id !== newWorkoutDef.id);
        newWorkouts.push(newWorkoutDef);
        storage.set('data_workouts', JSON.stringify(newWorkouts));

        onDonePressed();
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

    return (
        <View>
            <TouchableOpacity onPress={handleDeletePressed}>
                <Text className="text-red-400 text-right font-semibold text-lg mb-8">Delete</Text>
            </TouchableOpacity>
            <TextInput
                className="bg-gray-300 text-gray-800 p-2 mb-4 rounded text-2xl font-semibold"
                placeholder={workout?.title ?? 'Workout title'}
                placeholderTextColor="#777"
                value={title}
                onChangeText={setTitle}
            />
            <SwipeListView
                disableRightSwipe
                onEndReachedThreshold={0.3}
                onEndReached={(t) => { console.log('end reached') }}
                data={listData}
                renderItem={(data, _) => (
                    <View
                        className="bg-white p-4 rounded-lg border-y-4 border-gray-200"
                    >
                        <Text className="text-gray-800 text-xl mb-2">{data.item.text}</Text>
                        <View className='flex flex-row items-center gap-2'>
                            <View className='w-1 h-1 bg-green-500 rounded-full' />
                            <Text className='text-green-500 text-sm'>Progressing well</Text>
                        </View>
                    </View>
                )}
                renderHiddenItem={(data, rowMap) => (
                    <View className="bg-red-600 border-y-4 border-gray-200 h-full flex flex-row items-center justify-end rounded-xl">
                        <TouchableOpacity className="h-full w-1/4 flex justify-center pr-4" onPress={() => deleteExerciseFromBuilder(data.item.key)}>
                            <Text className='text-white text-right'>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                leftOpenValue={0}
                rightOpenValue={-75}
            />
            {
                exercises.length > 0 &&
                <View className="flex flex-row items-center justify-center gap-2 mt-2">
                    {/* <AntDesign name="doubleleft" size={10} color="#9ca3af" /> */}
                    <MaterialIcons name="swipe-left" size={18} color="#9ca3af" />
                    <Text className="text-gray-400">Swipe to delete an exercise</Text>
                </View>
            }
            <TouchableOpacity
                className="bg-blue-500 py-4 px-4 rounded-lg mt-4"
                onPress={goToExerciseSelection}
            >
                <Text className="text-white text-center font-semibold">+ Add exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="bg-green-600 py-4 px-4 rounded-lg mt-4"
                onPress={handleDonePressed}
            >
                <Text className="text-white text-center font-semibold">Save</Text>
            </TouchableOpacity>
        </View>
    )
};

export default EditableWorkoutExerciseList;