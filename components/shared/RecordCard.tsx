import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

export type RecordCardProps = {
  title: string;
  oldValue?: number;
  newValue?: number;
  className?: string;
}

export default function RecordCard({ title, oldValue, newValue, className }: RecordCardProps) {
  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(1);

  useEffect(() => {
    circleScale.value = withRepeat(withTiming(200, { duration: 3000 }), -1);
    circleOpacity.value = withRepeat(withTiming(0, { duration: 3000 }), -1);
  }, [])

  const animatedCircleStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: circleScale.value }], opacity: circleOpacity.value };
  });

  return (
    <View className={'flex-row items-center justify-between px-2 py-1 rounded-xl overflow-hidden ' + className}>
      <Animated.View className="w-1 h-1 bg-highlight rounded-full absolute" style={animatedCircleStyle} />
      <View className='flex-row items-center gap-2'>
        <AntDesign name="Trophy" size={14} color="#3b82f6" />
        <Text className='text-txt-secondary'>{title}</Text>
      </View>
      { oldValue !== undefined && newValue !== undefined && (
        <View className='flex-row items-center gap-2'>
          <Text className='text-txt-secondary'>{oldValue} kg</Text>
          <AntDesign name="arrowright" size={14} color="#3b82f6" />
          <Text className='text-txt-secondary'>{newValue} kg</Text>
        </View>
      )}
    </View>
  );
}