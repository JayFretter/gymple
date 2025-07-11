import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { storage } from '@/storage';
import uuid from 'react-native-uuid';
import GoalDefinition from '@/interfaces/GoalDefinition';
import { router } from 'expo-router';
import useGoalBuilderStore from '@/hooks/useGoalBuilderStore';
import { useIsFocused } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import WheelPicker from './WheelPicker';

export type EditGoalFormProps = {
  goalId: string | null;
};

export default function EditGoalForm(props: EditGoalFormProps) {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const isFocused = useIsFocused();

  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);
  const [isRepsModalVisible, setIsRepsModalVisible] = useState(false);

  const selectedExercise = useGoalBuilderStore(state => state.exercise);
  const removeGoalBuilderExercise = useGoalBuilderStore(state => state.removeExercise);

  const [selectedExerciseName, setSelectedExerciseName] = useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  useEffect(() => {
    if (isFocused) {
      if (props.goalId && !selectedExercise) {
        fetchGoal();
      }
      else if (selectedExercise) {
        setSelectedExerciseName(selectedExercise.name);
        setSelectedExerciseId(selectedExercise.id);
        removeGoalBuilderExercise();
      }
    }
  }, [isFocused]);

  const fetchGoal = () => {
    if (!props.goalId) {
      // initialiseNewGoal();
      return;
    }

    const storedGoalsString = storage.getString('data_goals');
    const storedGoals: GoalDefinition[] = storedGoalsString ? JSON.parse(storedGoalsString) : [];
    const goalToEdit = storedGoals.find(goal => goal.id === props.goalId);

    setSelectedExerciseName(goalToEdit?.associatedExerciseName || null);
    setSelectedExerciseId(goalToEdit?.associatedExerciseId || null);
    setWeight(goalToEdit?.weight.toString() || '');
    setReps(goalToEdit?.reps.toString() || '');
  }

  const handleWeightSelected = (value: string) => {
    setWeight(value);
    setIsWeightModalVisible(false);
  }

  const openWeightModal = () => {
    setIsWeightModalVisible(true)
  }

  const handleRepsSelected = (value: string) => {
    setReps(value);
    setIsRepsModalVisible(false);
  }

  const openRepsModal = () => {
    setIsRepsModalVisible(true)
  }

  const saveGoal = () => {
    const goalTitle = `${selectedExerciseName} - ${weight}kg x ${reps} reps`;

    const newGoal: GoalDefinition = {
      id: uuid.v4(),
      associatedExerciseName: selectedExerciseName!,
      associatedExerciseId: selectedExerciseId!,
      reps: parseInt(reps),
      weight: parseFloat(weight),
      percentage: 0
    };

    const existingGoals = storage.getString('data_goals');
    var goals: GoalDefinition[] = existingGoals ? JSON.parse(existingGoals) : [];

    goals.push(newGoal);

    storage.set('data_goals', JSON.stringify(goals));
    console.log('Goal saved:', newGoal);
  };

  const goToExerciseSelection = () => {
    router.push('/(exercises)/SelectExercisePage');
  };

  return (
    <View className="p-2 bg-gray-200 flex-1 items-center">
      <Modal isVisible={isWeightModalVisible} hideModalContentWhileAnimating>
        <View className='flex'>
          <WheelPicker
            data={Array.from({ length: 501 }, (_, i) => String(i))}
            secondaryData={['.0', '.5']}
            rowsVisible={7}
            rowHeight={40}
            label='kg'
            onItemSelected={handleWeightSelected}
          />
          <TouchableOpacity
            className="bg-red-600 py-3 rounded-lg mt-12"
            onPress={() => {
              setIsWeightModalVisible(!isWeightModalVisible);
            }}
          >
            <Text className="text-white text-center font-semibold">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal isVisible={isRepsModalVisible} hideModalContentWhileAnimating>
        <View className='flex'>
          <WheelPicker
            data={Array.from({ length: 51 }, (_, i) => String(i))}
            rowsVisible={7}
            rowHeight={40}
            onItemSelected={handleRepsSelected}
          />
          <TouchableOpacity
            className="bg-red-600 py-3 rounded-lg mt-10"
            onPress={() => {
              setIsRepsModalVisible(!isRepsModalVisible);
            }}
          >
            <Text className="text-white text-center font-semibold">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Text className="text-black text-2xl font-bold mb-4 self-start">Create a new goal</Text>
      <TouchableOpacity
        className="bg-gray-100 py-3 px-4 rounded-lg mb-4 w-full"
        onPress={goToExerciseSelection}
      >
        {selectedExerciseName ?
          <Text className="text-gray-800 text-center font-semibold">{selectedExerciseName}</Text> :
          <Text className="text-gray-800 text-center font-semibold">Select Exercise</Text>}
      </TouchableOpacity>
      {/* <View className='flex-row w-1/2 items-center justify-between gap-4 mb-4'>
        <Text className="text-black text-center font-semibold">Weight (kg):</Text>
        <TextInput
          className="bg-gray-400 text-white p-2 rounded"
          placeholder="0"
          placeholderTextColor="#FFF"
          keyboardType='number-pad'
          value={weight}
          onChangeText={setWeight}
        />
      </View> */}

      <View className="flex-row justify-between items-center mb-4">
        <View className='flex flex-row items-center justify-center gap-4 w-3/4'>
          <TouchableOpacity className="bg-gray-100 py-3 w-1/3 rounded-lg flex flex-row items-center justify-center gap-1" onPress={() => openWeightModal()}>
            <Text className="text-center text-gray-800 font-bold text-lg">{weight}</Text>
            <Text className="text-center text-gray-400 text-sm">kg</Text>
          </TouchableOpacity>
          <FontAwesome name="times" size={16} color="#9ca3af" />
          <TouchableOpacity className="bg-gray-100 py-3 w-1/3 rounded-lg flex flex-row items-center justify-center gap-1" onPress={() => openRepsModal()}>
            <Text className="text-center text-gray-800 font-bold text-lg">{reps}</Text>
            <Text className="text-center text-gray-400 text-sm">reps</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <View className='flex-row w-1/2 items-center justify-between gap-4 mb-4'>
        <Text className="text-black text-center font-semibold">Reps:</Text>
        <TextInput
          className="bg-gray-400 text-white p-2 rounded"
          placeholder="Reps"
          placeholderTextColor="#FFF"
          keyboardType='number-pad'
          value={reps}
          onChangeText={setReps}
        />
      </View> */}
      <TouchableOpacity
        className="bg-green-500 py-3 px-4 rounded-lg w-full"
        onPress={saveGoal}
      >
        <Text className="text-white text-center font-semibold">Save Goal</Text>
      </TouchableOpacity>
    </View>
  );
};