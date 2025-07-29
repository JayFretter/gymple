import ExerciseListItem from '@/components/ExerciseListItem';
import FilterListItem from '@/components/FilterListItem';
import GradientPressable from '@/components/shared/GradientPressable';
import { ExerciseCategory } from '@/enums/exercise-category';
import useGoalBuilderStore from '@/hooks/useGoalBuilderStore';
import useStorage from '@/hooks/useStorage';
import useWorkoutBuilderStore from '@/hooks/useWorkoutBuilderStore';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import FilterButtonState from '@/interfaces/FilterButtonState';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useIsFocused } from "@react-navigation/native";
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, LayoutChangeEvent, Text, TextInput, TouchableOpacity, View, ViewToken } from 'react-native';
import Animated, { useAnimatedRef, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function SelectExercisePage() {
  const isFocused = useIsFocused();
  const { fetchFromStorage } = useStorage();
  const [allExercises, setAllExercises] = useState<ExerciseDefinition[]>([]);
  const [shownExercises, setShownExercises] = useState<ExerciseDefinition[]>([]);
  const [exerciseFilters, setExerciseFilters] = useState<FilterButtonState<ExerciseCategory>[]>(Object.values(ExerciseCategory).map(c => {
    return { item: c, selected: false }
  }));
  const [exerciseSearchFilter, setExerciseSearchFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const viewableItems = useSharedValue<ViewToken[]>([])

  const isSingleExerciseMode = useWorkoutBuilderStore(state => state.isSingleExerciseMode);
  const exerciseBuilderExercises = useWorkoutBuilderStore(state => state.exercises);
  const addExerciseToWorkoutBuilder = useWorkoutBuilderStore(state => state.addExercise);
  const removeExerciseFromWorkoutBuilder = useWorkoutBuilderStore(state => state.removeExercise);
  const setExerciseInGoalBuilder = useGoalBuilderStore(state => state.setExercise);

  const [filterViewHeight, setFilterViewHeight] = useState<number | null>(null);

  const onLayoutFilterView = (e: LayoutChangeEvent) => {
    if (filterViewHeight === null) {
      setFilterViewHeight(e.nativeEvent.layout.height);
    }
  }

  const animatedFilterStyle = useAnimatedStyle(() => {
    if (!filterViewHeight)
      return {}

    return { height: withTiming(showFilters ? filterViewHeight : 0, { duration: 200 }) }
  })

  useEffect(() => {
    if (isFocused)
      fetchExercises();
  }, [isFocused])

  const fetchExercises = () => {
    const storedExercises = fetchFromStorage<ExerciseDefinition[]>('data_exercises') ?? [];
    setAllExercises(storedExercises);
    setShownExercises(storedExercises);
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
      setShownExercises(allExercises.filter(e => e.categories.includes(exerciseFilters[filterItemIdx].item)));
    } else {
      setShownExercises(allExercises);
    }
  }

  const handleExerciseSearchFilterChange = (text: string) => {
    setExerciseSearchFilter(text);
    const filteredExercises = allExercises.filter(e =>
      e.name.toLowerCase().includes(text.toLowerCase()) ||
      e.notes?.toLowerCase().includes(text.toLowerCase())
    );
    setShownExercises(filteredExercises);
  }

  const toggleExerciseSelected = (exercise: ExerciseDefinition) => {
    const isSelected = exerciseBuilderExercises.some(e => e.id === exercise.id);
    if (!isSelected)
      addExerciseToWorkoutBuilder(exercise);
    else
      removeExerciseFromWorkoutBuilder(exercise.id);
    // No need to update shownExercises or allExercises, selection is derived from store
  }

  const handleExercisePressed = (exercise: ExerciseDefinition) => {
    if (isSingleExerciseMode) {
      setExerciseInGoalBuilder(exercise);
      router.back();
    } else {
      toggleExerciseSelected(exercise);
    }
  }

  const handleShowFilterButtonPressed = () => {
    setShowFilters(!showFilters);
  }

  return (
    <View className='bg-primary flex-1 items-center pt-4'>
      <Text className='text-txt-primary text-3xl font-bold mb-4'>Exercise Selection</Text>
      <View className='flex-row items-center justify-between w-full px-4 mb-4'>
        <GradientPressable
          style='default'
          onPress={handleShowFilterButtonPressed}
        >
          <View className='flex-row items-center gap-1 py-2 px-2'>
            <AntDesign name="filter" size={18} color="white" />
            <Text className="text-white text-center font-semibold">Filters</Text>
          </View>
        </GradientPressable>
        <GradientPressable
          style='green'
          onPress={() => router.push('/workout/CreateExercisePage')}
        >
          <Text className="text-white text-center font-semibold my-2 mx-2">+ New exercise</Text>
        </GradientPressable>
      </View>
      <Animated.View className='w-full px-4' style={animatedFilterStyle} onLayout={onLayoutFilterView}>
        <View className='flex flex-row flex-wrap mb-4 gap-2 w-full'>
          {exerciseFilters.map((filter, index) => <FilterListItem key={index} itemIdx={index} name={filter.item} selected={filter.selected} onPressFn={handleFilterPressed}></FilterListItem>)}
        </View>
        <TextInput
          className="bg-card text-white p-2 w-full mb-4 rounded-xl"
          placeholder="Search all exercises..."
          placeholderTextColor="#EEE"
          value={exerciseSearchFilter}
          onChangeText={handleExerciseSearchFilterChange}
        />
      </Animated.View>
      <FlatList
        contentContainerStyle={{ paddingBottom: 80 }}
        className='w-full px-4 bg-primary'
        data={shownExercises}
        renderItem={(item) => {
          const isSelected = exerciseBuilderExercises.some(e => e.id === item.item.id);
          return <ExerciseListItem className='mb-3' exercise={item.item} isSelected={isSelected} onPress={() => handleExercisePressed(item.item)} />
        }}
        onViewableItemsChanged={({ viewableItems: items }) => viewableItems.value = items}
        showsVerticalScrollIndicator={false}
      />
      {!isSingleExerciseMode &&
        <GradientPressable className='absolute bottom-4 z-10 w-3/4' style='default' onPress={() => router.back()}>
          <Text className='text-gray-200 text-lg text-center py-2'>Add selected exercises</Text>
        </GradientPressable>
      }
    </View>
  );
}