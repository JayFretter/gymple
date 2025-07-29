import { WeightUnit } from "@/enums/weight-unit";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRef } from "react";
import { TextInput, TouchableOpacity, View, Text } from "react-native";

export type WeightAndRepsPickerProps = {
  onWeightSelected: (weight: number) => void;
  onRepsSelected: (reps: number) => void;
  weightUnit: WeightUnit;
  initialWeight?: number;
  initialReps?: number;
};

export function WeightAndRepsPicker({ onWeightSelected, onRepsSelected, weightUnit, initialWeight, initialReps }: WeightAndRepsPickerProps) {
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
      <TouchableOpacity className='flex-row gap-1 items-center justify-center bg-card rounded-xl px-4 py-2' onPress={() => weightInputRef.current?.focus()}>
        <TextInput
          className='text-txt-primary font-semibold text-lg'
          keyboardType='numeric'
          placeholder={initialWeight?.toString() || '0'}
          placeholderTextColor={'#9ca3af'}
          // defaultValue={initialWeight?.toString() || ''}
          onChangeText={onChangeWeight}
          ref={weightInputRef}
          onSubmitEditing={() => repsInputRef.current?.focus()}
          submitBehavior='submit'
        />
        <Text className='text-txt-secondary'>{weightUnit}</Text>
      </TouchableOpacity>
      <FontAwesome name="times" size={16} color="#9ca3af" />
      <TouchableOpacity className='flex-row gap-1 items-center justify-center bg-card rounded-xl px-4 py-2' onPress={() => repsInputRef.current?.focus()}>
        <TextInput
          className='text-txt-primary font-semibold text-lg'
          keyboardType='numeric'
          placeholder={initialReps?.toString() || '0'}
          placeholderTextColor={'#9ca3af'}
          // defaultValue={initialReps?.toString() || ''}
          onChangeText={onChangeReps}
          ref={repsInputRef}
        />
        <Text className='text-txt-secondary'>reps</Text>
      </TouchableOpacity>
    </View>
  );
}
