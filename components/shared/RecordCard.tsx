import AntDesign from "@expo/vector-icons/AntDesign";
import { Text, View } from "react-native";
import GradientPressable from "./GradientPressable";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

export type RecordCardProps = {
  title: string;
  oldValue: number;
  newValue: number;
}

export default function RecordCard({ title, oldValue, newValue }: RecordCardProps) {
  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(1);

  useEffect(() => {
    circleScale.value = withRepeat(withTiming(100, { duration: 2000 }), -1);
    circleOpacity.value = withRepeat(withTiming(0, { duration: 2000 }), -1);
  }, [])

  const animatedCircleStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: circleScale.value }], opacity: circleOpacity.value };
});

  return (
    <GradientPressable className='mb-8' style='default'>
      <View className='flex-row items-center justify-between px-2 py-1'>
        <Animated.View className="w-1 h-1 bg-blue-700 rounded-full absolute" style={animatedCircleStyle}/>
        <View className='flex-row items-center gap-2'>
          <AntDesign name="Trophy" size={14} color="#068bec" />
          <Text className='text-txt-primary font-semibold'>{title}</Text>
        </View>
        <View className='flex-row items-center gap-2'>
          <Text className='text-txt-primary'>{oldValue} kg</Text>
          <AntDesign name="arrowright" size={14} color="#068bec" />
          <Text className='text-txt-primary'>{newValue} kg</Text>
        </View>
      </View>
    </GradientPressable>
  );
}