import useCalculateGoalPerformance from '@/hooks/useCalculateGoalPerformance';
import useGoalBuilderStore from '@/hooks/useGoalBuilderStore';
import useUpsertGoal from '@/hooks/useUpsertGoal';
import useUserPreferences from '@/hooks/useUserPreferences';
import useWorkoutBuilderStore from '@/hooks/useWorkoutBuilderStore';
import GoalDefinition from '@/interfaces/GoalDefinition';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import uuid from 'react-native-uuid';
import { WeightAndRepsPicker } from './shared/WeightAndRepsPicker';
import useStorage from '@/hooks/useStorage';
import { WeightUnit } from '@/enums/weight-unit';
import GradientPressable from './shared/GradientPressable';

export type EditGoalFormProps = {
  goalId: string | null;
};

export default function EditGoalForm(props: EditGoalFormProps) {
  const [weight, setWeight] = useState<number>(0);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(WeightUnit.KG);
  const [reps, setReps] = useState<number>(0);

  const isFocused = useIsFocused();
  const { fetchFromStorage } = useStorage();

  const selectedExercise = useGoalBuilderStore(state => state.exercise);
  const removeGoalBuilderExercise = useGoalBuilderStore(state => state.removeExercise);

  const {calculateGoalPercentageAllTime} = useCalculateGoalPerformance();
  const upsertGoal = useUpsertGoal();

  const [selectedExerciseName, setSelectedExerciseName] = useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  
  const setIsExerciseBuilderModeSingle = useWorkoutBuilderStore(state => state.setIsSingleExerciseMode);
  const clearExerciseBuilderExercises = useWorkoutBuilderStore(state => state.clearAll);

  const isNewGoal: boolean = !props.goalId;

  const [getUserPreferences] = useUserPreferences();

  useEffect(() => {
    if (isFocused) {
      if (!isNewGoal && !selectedExercise) {
        fetchGoal();
      }
      else if (selectedExercise) {
        setSelectedExerciseName(selectedExercise.name);
        setSelectedExerciseId(selectedExercise.id);
        removeGoalBuilderExercise();
      } else {
        const userPreferences = getUserPreferences();
        setWeightUnit(userPreferences.weightUnit);
      }
    }
  }, [isFocused]);

  const fetchGoal = () => {
    if (!props.goalId) {
      return;
    }

    const storedGoals = fetchFromStorage<GoalDefinition[]>('data_goals') ?? [];
    const goalToEdit = storedGoals.find(goal => goal.id === props.goalId);

    setSelectedExerciseName(goalToEdit?.associatedExerciseName || null);
    setSelectedExerciseId(goalToEdit?.associatedExerciseId || null);
    setWeight(goalToEdit?.weight || 0);
    setWeightUnit(goalToEdit?.weightUnit || WeightUnit.KG);
    setReps(goalToEdit?.reps || 0);
  }

  const saveGoal = () => {
    const newGoal: GoalDefinition = {
      id: props.goalId || uuid.v4(),
      associatedExerciseName: selectedExerciseName!,
      associatedExerciseId: selectedExerciseId!,
      reps: reps,
      weight: weight,
      weightUnit: weightUnit,
      percentage: 0
    };

    const perc = getPercentageOfGoalCompleted(newGoal);
    console.log('Calculated goal percentage:', perc)

    newGoal.percentage = perc;

    upsertGoal(newGoal);

    router.back();
  };

  const getPercentageOfGoalCompleted = (goal: GoalDefinition) => {
    return calculateGoalPercentageAllTime(goal);
  }

  const goToExerciseSelection = () => {
    setIsExerciseBuilderModeSingle(true);
    clearExerciseBuilderExercises();
    router.push('/dashboard/SelectExercisePage');
  };

  return (
    <View className="p-2 bg-primary flex-1 items-center">
      {isNewGoal ?
        <Text className="text-txt-primary text-2xl font-bold mb-4 self-start">Create a new goal</Text> :
        <Text className="text-txt-primary text-2xl font-bold mb-4 self-start">Edit goal</Text>
      }
      <GradientPressable
        style='gray'
        className="mb-4 w-full"
        onPress={goToExerciseSelection}
      >
        <View className="py-3">
          {selectedExerciseName ?
            <Text className="text-txt-primary text-center font-semibold">{selectedExerciseName}</Text> :
            <Text className="text-txt-primary text-center font-semibold">Select Exercise</Text>}
        </View>
      </GradientPressable>
      <WeightAndRepsPicker onWeightSelected={setWeight} onRepsSelected={setReps} weightUnit={weightUnit} initialWeight={weight} initialReps={reps} />
      <GradientPressable
        style='gray'
        className="w-full mt-4"
        onPress={() => setWeightUnit(weightUnit === WeightUnit.KG ? WeightUnit.LBS : WeightUnit.KG)}
      >
        <View className="py-2 flex-row items-center justify-center gap-1">
          <AntDesign name="swap" size={14} color="white" />
          <Text className="text-txt-secondary text-center">kg/lbs</Text>
        </View>
      </GradientPressable>
      <GradientPressable
        style='green'
        className="w-full mt-4"
        onPress={saveGoal}
      >
        <View className="py-3">
          <Text className="text-white text-center font-semibold">Save Goal</Text>
        </View>
      </GradientPressable>
    </View>
  );
};