import { WeightUnit } from "@/enums/weight-unit";
import useThemeColours from "@/hooks/useThemeColours";
import { SetPerformanceData } from "@/interfaces/ExercisePerformanceData";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export type SetsListSetProps = {
  set: SetPerformanceData;
  index: number;
  onWeightChange?: (index: number, weight: number) => void;
  onRepsChange?: (index: number, reps: number) => void;
  previousSessionSets: SetPerformanceData[];
  weightUnit: WeightUnit;
}

const SELECTED_SCALE = 1.35;

export default function SetsListSet({ set, index, onWeightChange, onRepsChange, previousSessionSets, weightUnit }: SetsListSetProps) {
  useEffect(() => {
    setInputValuesFromSet();
  }, [set]);
  
  const [input0Value, setInput0Value] = useState<string>('');
  const [input1Value, setInput1Value] = useState<string>('');

  const input0Ref = useRef<TextInput>(null);
  const input1Ref = useRef<TextInput>(null);

  const themeColour = useThemeColours();

  // Animation shared values
  const input0Scale = useSharedValue(1);
  const input1Scale = useSharedValue(1);

  // Animated styles for input + unit
  const input0AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(input0Scale.value, { duration: 180 }) }]
  }));
  const input1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(input1Scale.value, { duration: 180 }) }]
  }));

  const setInputValuesFromSet = () => {
    if (set.type === 'weight') {
      setInput0Value(set.weight.toString());
      setInput1Value(set.reps.toString());
    } else if (set.type === 'distance') {
      setInput0Value(set.distance.toString());
    }
  }

  const handlePress = (index: number) => {
    input0Ref.current?.focus();
  }

  const selectSecondInput = () => {
    input1Ref.current?.focus();
  }

  // When input loses focus, reset scale
  const handleInput0Blur = () => {
    input0Scale.value = 1;

    const weight = parseFloat(input0Value);
    if (!isNaN(weight)) {
      setInput0Value(weight.toString());
      onWeightChange?.(index, weight);
    }
  };
  const handleInput1Blur = () => {
    input1Scale.value = 1;

    const reps = parseFloat(input1Value);
    if (!isNaN(reps)) {
      setInput1Value(reps.toString());
      onRepsChange?.(index, reps);
    }
  };

  const onChangeWeight = (weightText: string) => {
    setInput0Value(weightText);
  }

  const onChangeReps = (repsText: string) => {
    setInput1Value(repsText);
  }

  const renderSet = (set: SetPerformanceData, index: number) => {
    if (set.type === 'weight') {
      return (
        <>
          <Text className="text-center text-txt-primary font-bold text-xl">Set {index + 1}</Text>
          <View>
            {previousSessionSets[index]?.type === 'weight' ?
              <Text className="text-center text-txt-secondary text-sm">Prev: {previousSessionSets[index].weight} x {previousSessionSets[index].reps}</Text> :
              <Text className="text-center text-txt-secondary text-sm">-</Text>
            }
          </View>
          <View className='flex-row justify-between items-center gap-4'>
            <Animated.View style={input0AnimatedStyle} className='flex-row gap-1 items-center justify-center'>
              <Pressable className='flex-row gap-1 items-center justify-center' hitSlop={8} onPress={() => input0Ref.current?.focus()}>
                <TextInput
                  className='text-txt-primary font-semibold text-xl py-0'
                  ref={input0Ref}
                  keyboardType="numeric"
                  onFocus={() => {
                    input0Scale.value = SELECTED_SCALE;
                  }}
                  value={input0Value}
                  placeholder={set.weight.toString()}
                  placeholderTextColor={themeColour('txt-secondary')}
                  onBlur={handleInput0Blur}
                  onSubmitEditing={selectSecondInput}
                  submitBehavior='submit'
                  onChangeText={onChangeWeight}
                />
                <Text className='text-txt-secondary'>{weightUnit}</Text>
              </Pressable>
            </Animated.View>
            <FontAwesome name="times" size={16} color="#9ca3af" />
            <Animated.View style={input1AnimatedStyle}>
              <Pressable className='flex-row gap-1 items-center justify-center' hitSlop={8} onPress={() => input1Ref.current?.focus()}>
                <TextInput
                  className='text-txt-primary font-semibold text-xl py-0'
                  ref={input1Ref}
                  keyboardType="numeric"
                  onFocus={() => {
                    input1Scale.value = SELECTED_SCALE;
                  }}
                  value={input1Value}
                  placeholder={set.reps.toString()}
                  placeholderTextColor={themeColour('txt-secondary')}
                  onBlur={handleInput1Blur}
                  onChangeText={onChangeReps}
                />
                <Text className='text-txt-secondary'>reps</Text>
              </Pressable>
            </Animated.View>
          </View>
        </>
      )
    } else if (set.type === 'distance') {
      return (
        <>
          <Text className="text-center text-txt-primary font-bold text-xl">Set {index + 1}</Text>
          <View>
            {previousSessionSets[index]?.type === 'distance' ?
              <Text className="text-center text-txt-secondary text-sm">Prev: {previousSessionSets[index].distance} {previousSessionSets[index].distanceUnit}</Text> :
              <Text className="text-center text-txt-secondary text-sm">-</Text>
            }
          </View>
          <View className='flex-row justify-between items-center gap-4'>
            <Animated.View style={input0AnimatedStyle} className='flex-row gap-1 items-center justify-center'>
              <Text className='text-txt-primary font-semibold text-xl'>{set.distance}</Text>
              <Animated.Text style={input0AnimatedStyle} className='text-txt-secondary'>{set.distanceUnit}</Animated.Text>
            </Animated.View>
          </View>
        </>
      )
    }
  }

  return (
    <Pressable
      className="bg-card flex-row justify-between items-center px-4 py-4 rounded-xl active:bg-primary"
      onPress={() => handlePress(index)}
    >
      {renderSet(set, index)}
    </Pressable>
  )
}