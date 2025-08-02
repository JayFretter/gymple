import ExerciseListItem from '@/components/ExerciseListItem';
import GradientPressable from '@/components/shared/GradientPressable';
import MuscleIcon from '@/components/shared/MuscleIcon';
import PopUp from '@/components/shared/PopUp';
import { ExerciseCategory } from '@/enums/exercise-category';
import useGoalBuilderStore from '@/hooks/useGoalBuilderStore';
import useStorage from '@/hooks/useStorage';
import useWorkoutBuilderStore from '@/hooks/useWorkoutBuilderStore';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useIsFocused } from "@react-navigation/native";
import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SelectExercisePage() {
  const isFocused = useIsFocused();
  const { fetchFromStorage } = useStorage();
  const [allExercises, setAllExercises] = useState<ExerciseDefinition[]>([]);
  const [selectedExerciseCategory, setSelectedExerciseCategory] = useState<string>('All');
  const [exerciseSearchFilter, setExerciseSearchFilter] = useState<string>('');
  const [isFilterPopUpVisible, setIsFilterPopUpVisible] = useState<boolean>(false);


  const isSingleExerciseMode = useWorkoutBuilderStore(state => state.isSingleExerciseMode);
  const exerciseBuilderExercises = useWorkoutBuilderStore(state => state.exercises);
  const addExerciseToWorkoutBuilder = useWorkoutBuilderStore(state => state.addExercise);
  const removeExerciseFromWorkoutBuilder = useWorkoutBuilderStore(state => state.removeExercise);
  const setExerciseInGoalBuilder = useGoalBuilderStore(state => state.setExercise);

  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused)
      fetchExercises();
  }, [isFocused])

  useEffect(() => {
    if (isSingleExerciseMode) return;

    navigation.setOptions({
      headerRight: () => (
        <Pressable className='active:opacity-75' onPress={() => router.back()}>
          <Text className="text-blue-500 font-semibold text-lg">Done</Text>
        </Pressable>
      )
    })
  }, [navigation, isSingleExerciseMode])

  const fetchExercises = () => {
    const storedExercises = fetchFromStorage<ExerciseDefinition[]>('data_exercises') ?? [];
    setAllExercises(storedExercises);
  }

  const handleFilterPressed = (category: string) => {
    setSelectedExerciseCategory(category);
    setIsFilterPopUpVisible(false);
  }

  const handleExerciseSearchFilterChange = (text: string) => {
    setExerciseSearchFilter(text);
  }

  const toggleExerciseSelected = (exercise: ExerciseDefinition) => {
    const isSelected = exerciseBuilderExercises.some(e => e.id === exercise.id);
    if (!isSelected)
      addExerciseToWorkoutBuilder(exercise);
    else
      removeExerciseFromWorkoutBuilder(exercise.id);
  }

  const handleExercisePressed = (exercise: ExerciseDefinition) => {
    if (isSingleExerciseMode) {
      setExerciseInGoalBuilder(exercise);
      router.back();
    } else {
      toggleExerciseSelected(exercise);
    }
  }

  const getShownExercises = () => {
    const filteredExercises = allExercises.filter(e =>
      e.name.toLowerCase().includes(exerciseSearchFilter.trim().toLowerCase()) &&
      (selectedExerciseCategory === 'All' || e.categories.includes(selectedExerciseCategory as ExerciseCategory))
    );

    console.log('getShownExercises called');

    return filteredExercises.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <View className='bg-primary flex-1 items-center pt-4'>
      <PopUp visible={isFilterPopUpVisible} onClose={() => setIsFilterPopUpVisible(false)} closeButtonText='Done' >
        <Text className='text-xl text-txt-primary font-semibold text-center mb-4'>Filter By Exercise Type</Text>
        <ScrollView className='max-h-[50vh]'>
          <TouchableOpacity onPress={() => handleFilterPressed('All')}>
            <Text className={`text-txt-primary bg-card rounded-xl text-center py-2 mb-2 ${selectedExerciseCategory === 'All' ? 'bg-[#2a53b5]' : 'bg-card'}`}>All Exercises</Text>
          </TouchableOpacity>
          <View className='flex-row flex-wrap gap-2'>
            {Object.values(ExerciseCategory).map((category, index) => (
              <TouchableOpacity
                key={index}
                className={`py-2 px-4 rounded-lg flex-grow flex items-center justify-center ${selectedExerciseCategory === String(category) ? 'bg-[#2a53b5]' : 'bg-card'}`}
                onPress={() => handleFilterPressed(String(category))}
              >
                <MuscleIcon category={category} size={30} />
                <Text className='text-txt-primary'>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </PopUp>
      <Text className='text-txt-primary text-3xl font-bold mb-4'>Exercise Selection</Text>
      <View className='flex-row items-center justify-between w-full px-4 mb-4'>
        <GradientPressable
          style='default'
          onPress={() => setIsFilterPopUpVisible(true)}
        >
          <View className='flex-row items-center gap-1 py-2 px-2'>
            <AntDesign name="filter" size={16} color="white" />
            <Text className="text-white text-center font-semibold">Filter ({selectedExerciseCategory})</Text>
          </View>
        </GradientPressable>
        <GradientPressable
          style='default'
          onPress={() => router.push('/workout/CreateExercisePage')}
        >
          <Text className="text-white text-center font-semibold my-2 mx-2">+ New exercise</Text>
        </GradientPressable>
      </View>
      <View className='w-full px-4'>
        <TextInput
          className="bg-card text-white p-2 w-full mb-4 rounded-xl"
          placeholder={`Search ${selectedExerciseCategory.toLowerCase()} exercises...`}
          placeholderTextColor="#AAAAAA"
          value={exerciseSearchFilter}
          onChangeText={handleExerciseSearchFilterChange}
        />
      </View>
      <FlatList
        className='w-full px-4 bg-primary'
        data={getShownExercises()}
        renderItem={(item) => {
          const isSelected = exerciseBuilderExercises.some(e => e.id === item.item.id);
          return <ExerciseListItem className='mb-3' exercise={item.item} isSelected={isSelected} onPress={() => handleExercisePressed(item.item)} />
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}