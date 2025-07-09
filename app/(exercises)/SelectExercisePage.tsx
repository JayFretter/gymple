import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ViewToken } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { storage } from '@/storage';
import { router } from 'expo-router';
import ExerciseListItem from '@/components/ExerciseListItem';
import { useSharedValue } from 'react-native-reanimated';
import useWorkoutBuilderStore from '@/hooks/useWorkoutBuilderStore';
import FilterListItem from '@/components/FilterListItem';
import FilterButtonState from '@/interfaces/FilterButtonState';

export type SelectExercisePageProps = {
  callbackFn?: (exerciseName: string) => void;
};

export default function SelectExercisePage(props: SelectExercisePageProps) {
  const isFocused = useIsFocused();
  const [exercises, setExercises] = useState<ExerciseDefinition[]>([]);
  const [exerciseFilters, setExerciseFilters] = useState<FilterButtonState[]>([
    { name: 'All', selected: true },
    { name: 'Chest', selected: false },
    { name: 'Back', selected: false },
    { name: 'Legs', selected: false },
    { name: 'Arms', selected: false },
    { name: 'Shoulders', selected: false },
    { name: 'Abs', selected: false },
    { name: 'Misc.', selected: false }
  ]);
  const viewableItems = useSharedValue<ViewToken[]>([])
  const addExeriseToWorkoutBuilder = useWorkoutBuilderStore(state => state.addExercise);

  useEffect(() => {
    if (isFocused)
      fetchExercises();
  }, [isFocused])

  const fetchExercises = () => {
    const storedExercisesString = storage.getString('data_exercises');
    const storedExercises: ExerciseDefinition[] = storedExercisesString ? JSON.parse(storedExercisesString) : [];

    setExercises(storedExercises);
  }

  const handleFilterPressed = (filterItemIdx: number) => {
    console.log('Filter pressed:', exerciseFilters[filterItemIdx].name);
    const newFilters = exerciseFilters.map((filter, index) => {
      if (index === filterItemIdx) {
        return { ...filter, selected: !filter.selected };
      }
      return { ...filter, selected: false };
    });
    setExerciseFilters(newFilters);
  }

  const handleExercisePressed = (exercise: ExerciseDefinition) => {
    addExeriseToWorkoutBuilder(exercise);
    router.back();
  }

  return (
    <View className='bg-gray-200 flex-1 justify-center items-center pt-32 pb-20'>
      {/* <TouchableOpacity
        className="bg-green-500 py-3 px-4 rounded-lg mb-8"
        onPress={() => router.push('/(exercises)/CreateExercisePage')}
      >
        <Text className="text-white text-center font-semibold">Create a new exercise</Text>
      </TouchableOpacity> */}
      <Text className='text-gray-800 text-3xl font-bold mb-8'>Exercise Selection</Text>
      <View className='flex flex-row flex-wrap mb-8 gap-2 px-2'>
        {exerciseFilters.map((filter, index) => <FilterListItem key={index} itemIdx={index} name={filter.name} selected={filter.selected} onPressFn={handleFilterPressed}></FilterListItem>)}
      </View>
      <View className='flex w-full items-center'>
        <FlatList
          className='w-[95%]'
          data={exercises}
          renderItem={(item) => {
            return <ExerciseListItem itemId={item.index} className='mb-4' exercise={item.item} viewableItems={viewableItems} onPress={handleExercisePressed} />
          }}
          onViewableItemsChanged={({ viewableItems: items }) => viewableItems.value = items}
        />
      </View>
    </View>
  );
}
