import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ViewToken } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { storage } from '@/storage';
import { router } from 'expo-router';
import ExerciseListItem from '@/components/ExerciseListItem';
import { useSharedValue } from 'react-native-reanimated';

export type SelectExercisePageProps = {
  callbackFn?: (exerciseName: string) => void;
};

export default function SelectExercise(props: SelectExercisePageProps) {
  const isFocused = useIsFocused();
  const [exercises, setExercises] = useState<ExerciseDefinition[]>([]);
  const viewableItems = useSharedValue<ViewToken[]>([])

  useEffect(() => {
    if (isFocused)
      fetchExercises();
  }, [isFocused])

  const fetchExercises = () => {
    console.log('Fetching exercises 2');
    const storedExercisesString = storage.getString('data_exercises');
    const storedExercises: ExerciseDefinition[] = storedExercisesString ? JSON.parse(storedExercisesString) : [];

    setExercises(storedExercises);
  }

  const onSelectExercise = (exercise: ExerciseDefinition) => {
    if (props.callbackFn) {
      props.callbackFn(exercise.name);
    }
  }

  return (
    <View className='bg-slate-900 flex-1 justify-center items-center pt-20 pb-20'>
      <TouchableOpacity
        className="bg-green-500 py-3 px-4 rounded-lg"
        onPress={() => router.push('./createExercise')}
      >
        <Text className="text-white text-center font-semibold">Create a new exercise</Text>
      </TouchableOpacity>
      <Text className='text-gray-200 text-xl mb-8'>Please select your exercise:</Text>
      <View className='flex w-full items-center'>
        <FlatList
          className='w-[95%]'
          data={exercises}
          renderItem={(item) => {
            return <ExerciseListItem itemId={item.index} className='mb-8' exercise={item.item} viewableItems={viewableItems} />
          }}
          onViewableItemsChanged={({viewableItems: items}) => viewableItems.value = items}
        />
      </View>
    </View>
  );
}
