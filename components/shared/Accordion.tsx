import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

export interface AccordionProps {
    title: string;
    children?: React.ReactNode;
    animated?: boolean;
    className?: string;
}

export default function Accordion({ title, children, animated = false, className }: AccordionProps) {
  const [open, setOpen] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: animated ? withTiming(open ? 500 : 0, { duration: 500 }) : (open ? 500 : 0),
    overflow: 'hidden',
  }));

  function toggle() {
    setOpen((prev) => !prev);
  }

  return (
    <View className={`overflow-hidden ${className}`}>
      <TouchableOpacity className="flex-row items-center justify-between" onPress={toggle} activeOpacity={0.8}>
        <Text className="text-txt-primary text-lg font-semibold flex-1">{title}</Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={20} color="#068bec" />
      </TouchableOpacity>
      <Animated.View style={animatedStyle} className="mt-2">
        {open && children}
      </Animated.View>
    </View>
  );
}