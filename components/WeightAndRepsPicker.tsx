import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRef } from "react";
import { TextInput, TouchableOpacity, View, Text } from "react-native";

export type WeightAndRepsPickerProps = {
  onWeightSelected: (weight: number) => void;
  onRepsSelected: (reps: number) => void;
  initialWeight?: number;
  initialReps?: number;
};

export function WeightAndRepsPicker({ onWeightSelected, onRepsSelected, initialWeight, initialReps }: WeightAndRepsPickerProps) {
  const weightInputRef = useRef<TextInput>(null);
  const repsInputRef = useRef<TextInput>(null);

  const onChangeWeight = (weightText: string) => {
    const weight = parseFloat(weightText);
    if (!isNaN(weight)) {
      onWeightSelected(weight);
    }
  }

  const onChangeReps = (repsText: string) => {
    const reps = parseFloat(repsText);
    if (!isNaN(reps)) {
      onRepsSelected(reps);
    }
  }

  return (
    <View className="flex-row justify-between items-center gap-4">
      <TouchableOpacity className='flex-row gap-1 items-center justify-center bg-gray-300 rounded-xl px-4 py-2' onPress={() => weightInputRef.current?.focus()}>
        <TextInput
          className='text-gray-800 font-semibold text-lg'
          keyboardType='numeric'
          placeholder='0'
          defaultValue={initialWeight?.toString() || ''}
          onChangeText={onChangeWeight}
          ref={weightInputRef}
        />
        <Text className='text-gray-600'>kg</Text>
      </TouchableOpacity>
      <FontAwesome name="times" size={16} color="#9ca3af" />
      <TouchableOpacity className='flex-row gap-1 items-center justify-center bg-gray-300 rounded-xl px-4 py-2' onPress={() => repsInputRef.current?.focus()}>
        <TextInput
          className='text-gray-800 font-semibold text-lg'
          keyboardType='numeric'
          placeholder='0'
          defaultValue={initialReps?.toString() || ''}
          onChangeText={onChangeReps}
          ref={repsInputRef}
        />
        <Text className='text-gray-600'>reps</Text>
      </TouchableOpacity>
    </View>
  );
}
