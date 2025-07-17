import { useEffect, useState } from 'react';
import { View, Text, FlatList, ViewToken, TextInput, TouchableOpacity } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { storage } from '@/storage';
import { router } from 'expo-router';
import ExerciseListItem from '@/components/ExerciseListItem';
import { useSharedValue } from 'react-native-reanimated';
import useWorkoutBuilderStore from '@/hooks/useWorkoutBuilderStore';
import useGoalBuilderStore from '@/hooks/useGoalBuilderStore';
import FilterListItem from '@/components/FilterListItem';
import FilterButtonState from '@/interfaces/FilterButtonState';

export type SelectExercisePageProps = {
  callbackFn?: (exerciseName: string) => void;
};

interface SelectableExercise {
  exercise: ExerciseDefinition;
  isSelected: boolean;
}

export default function SelectExercisePage(props: SelectExercisePageProps) {
  const isFocused = useIsFocused();
  const [allExercises, setAllExercises] = useState<SelectableExercise[]>([]);
  const [shownExercises, setShownExercises] = useState<SelectableExercise[]>([]);
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
  const [exerciseSearchFilter, setExerciseSearchFilter] = useState<string>('');
  const viewableItems = useSharedValue<ViewToken[]>([])

  const addExerciseToWorkoutBuilder = useWorkoutBuilderStore(state => state.addExercise);
  const removeExerciseFromWorkoutBuilder = useWorkoutBuilderStore(state => state.removeExercise);
  const setExerciseInGoalBuilder = useGoalBuilderStore(state => state.setExercise);

  useEffect(() => {
    if (isFocused)
      fetchExercises();
  }, [isFocused])

  const fetchExercises = () => {
    const storedExercisesString = storage.getString('data_exercises');
    const storedExercises: ExerciseDefinition[] = storedExercisesString ? JSON.parse(storedExercisesString) : [];

    const selectedExercises = storedExercises.map(e => ({ exercise: e, isSelected: false }));

    setAllExercises(selectedExercises);
    setShownExercises(selectedExercises);
  }

  const handleFilterPressed = (filterItemIdx: number) => {
    const newFilters = exerciseFilters.map((filter, index) => {
      if (index === filterItemIdx) {
        return { ...filter, selected: !filter.selected };
      }
      return { ...filter, selected: false };
    });
    setExerciseFilters(newFilters);
    setExerciseSearchFilter('');

    if (filterItemIdx !== 0) {
      // Filter is not 'All'
      setShownExercises(allExercises.filter(e => e.exercise.category === exerciseFilters[filterItemIdx].name));
    } else {
      setShownExercises(allExercises);
    }
  }

  const handleExerciseSearchFilterChange = (text: string) => {
    setExerciseSearchFilter(text);
    const filteredExercises = allExercises.filter(e =>
      e.exercise.name.toLowerCase().includes(text.toLowerCase()) ||
      e.exercise.notes?.toLowerCase().includes(text.toLowerCase())
    );
    setShownExercises(filteredExercises);
  }

  const toggleExerciseSelected = (item: SelectableExercise) => {
    if (!item.isSelected)
      addExerciseToWorkoutBuilder(item.exercise);
    else
      removeExerciseFromWorkoutBuilder(item.exercise.id);

    setShownExercises(prev => prev.map(ex => ex.exercise.id === item.exercise.id ? { ...ex, isSelected: !ex.isSelected } : ex));
    setAllExercises(prev => prev.map(ex => ex.exercise.id === item.exercise.id ? { ...ex, isSelected: !ex.isSelected } : ex));
  }

  const handleExercisePressed = (item: SelectableExercise) => {
    toggleExerciseSelected(item);
    setExerciseInGoalBuilder(item.exercise);
    // router.back();
  }

  return (
    <View className='bg-gray-200 flex-1 items-center'>
      {/* <TouchableOpacity
        className="bg-green-500 py-3 px-4 rounded-lg mb-8"
        onPress={() => router.push('/(exercises)/CreateExercisePage')}
      >
        <Text className="text-white text-center font-semibold">Create a new exercise</Text>
      </TouchableOpacity> */}
      <Text className='text-gray-800 text-3xl font-bold mb-8'>Exercise Selection</Text>
      <View className='flex flex-row flex-wrap mb-4 gap-2 px-2'>
        {exerciseFilters.map((filter, index) => <FilterListItem key={index} itemIdx={index} name={filter.name} selected={filter.selected} onPressFn={handleFilterPressed}></FilterListItem>)}
      </View>
      <TextInput
        className="bg-gray-400 text-white p-2 w-full mx-2 mb-8 rounded-xl"
        placeholder="Search all exercises..."
        placeholderTextColor="#EEE"
        value={exerciseSearchFilter}
        onChangeText={handleExerciseSearchFilterChange}
      />
      <View className='flex w-full items-center pb-80'>
        <FlatList
          className='w-[95%]'
          data={shownExercises}
          renderItem={(item) => {
            return <ExerciseListItem className='mb-4' exercise={item.item.exercise} isSelected={item.item.isSelected} onPress={() => handleExercisePressed(item.item)} />
          }}
          onViewableItemsChanged={({ viewableItems: items }) => viewableItems.value = items}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity className='bg-blue-500 px-4 py-2 rounded-xl absolute bottom-4'>
          <Text className='text-gray-200 text-lg'>Add selected exercises</Text>
      </TouchableOpacity>
    </View>
  );
}
