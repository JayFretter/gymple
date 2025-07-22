import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRef, useState } from "react";
import { TextInput, TouchableOpacity, View, Text } from "react-native";

export type WeightAndRepsPickerLargeProps = {
  onWeightSelected: (weight: number) => void;
  onRepsSelected: (reps: number) => void;
  weightUnit: 'kg' | 'lbs';
  placeholderWeight?: number;
  placeholderReps?: number;
  onFormComplete?: () => void;
};

export function WeightAndRepsPickerLarge({ onWeightSelected, onRepsSelected, weightUnit, placeholderWeight, placeholderReps, onFormComplete }: WeightAndRepsPickerLargeProps) {
  const weightInputRef = useRef<TextInput>(null);
  const repsInputRef = useRef<TextInput>(null);

  const [weightInputFocused, setWeightInputFocused] = useState(false);
  const [repsInputFocused, setRepsInputFocused] = useState(false);

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
      <TouchableOpacity
        className='flex-row gap-2 items-center justify-center bg-card rounded-xl px-4 py-2'
        onPress={() => weightInputRef.current?.focus()}
      >
        <TextInput
          className='text-txt-primary font-semibold text-2xl'
          keyboardType='numeric'
          placeholder={placeholderWeight?.toString() ?? '0'}
          placeholderTextColor={'#AAAAAA'}
          onChangeText={onChangeWeight}
          ref={weightInputRef}
          onSubmitEditing={() => repsInputRef.current?.focus()}
          submitBehavior='submit'
        />
        <Text className='text-txt-secondary'>{weightUnit}</Text>
      </TouchableOpacity>
      <FontAwesome name="times" size={16} color="#9ca3af" />
      <TouchableOpacity
        className='flex-row gap-2 items-center justify-center bg-card rounded-xl px-4 py-2'
        onPress={() => repsInputRef.current?.focus()}>
        <TextInput
          className='text-txt-primary font-semibold text-2xl'
          keyboardType='numeric'
          placeholder={placeholderReps?.toString() ?? '0'}
          placeholderTextColor={'#AAAAAA'}
          onChangeText={onChangeReps}
          ref={repsInputRef}
          onSubmitEditing={onFormComplete}
        />
        <Text className='text-txt-secondary'>reps</Text>
      </TouchableOpacity>
    </View>
  );
}
