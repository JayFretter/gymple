import { DistanceUnit } from "@/enums/distance-unit";
import { useRef } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export type DistancePickerLargeProps = {
  onDistanceSelected: (distance: number) => void;
  distanceUnit: DistanceUnit;
  placeholderDistance?: number;
  onFormComplete?: () => void;
};

export function DistancePickerLarge({ onDistanceSelected, distanceUnit, placeholderDistance, onFormComplete }: DistancePickerLargeProps) {
  const distanceInputRef = useRef<TextInput>(null);

  const onChangeDistance = (distanceText: string) => {
    const distance = parseFloat(distanceText);
    if (!isNaN(distance)) {
      onDistanceSelected(distance);
    }
  }

  return (
    <View className="flex-row justify-between items-center gap-4">
      <TouchableOpacity
        className='flex-row gap-2 items-center justify-center bg-card rounded-xl px-4 py-1'
        onPress={() => distanceInputRef.current?.focus()}
      >
        <TextInput
          className='text-txt-primary font-semibold text-2xl'
          keyboardType='numeric'
          placeholder={placeholderDistance?.toString() ?? '0'}
          placeholderTextColor={'#AAAAAA'}
          onChangeText={onChangeDistance}
          ref={distanceInputRef}
          autoFocus
          onSubmitEditing={onFormComplete}
        />
        <Text className='text-txt-secondary'>{distanceUnit}</Text>
      </TouchableOpacity>
    </View>
  );
}
