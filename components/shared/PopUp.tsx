import React, { useEffect } from 'react';
import { View, TouchableWithoutFeedback, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import GradientPressable from './GradientPressable';
import { LinearGradient } from 'expo-linear-gradient';

export type PopUpProps = {
  visible: boolean;
  onClose: () => void;
  closeButtonText?: string
  children?: React.ReactNode;
};

export default function PopUp({ visible, onClose, closeButtonText, children }: PopUpProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = 1; // Expand the popup
    } else {
      scale.value = 0; // Collapse the popup
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 200 }) }],
    opacity: scale.value,
  }));

  if (!visible) return null;

  return (
    <Pressable
      className='absolute inset-0 z-20 bg-[#111111EE] flex items-center justify-center'
      onPress={onClose}
    >
        <Animated.View
          style={animatedStyle}
          className="bg-primary rounded-lg p-6 w-[90%] shadow-lg border border-gray-700"
        >
          {children}
          <GradientPressable className='mt-4' style='gray' onPress={onClose}>
            <Text className='text-white font-semibold px-2 py-2 text-center' >{closeButtonText ?? 'Close'}</Text>
          </GradientPressable>
        </Animated.View>
    </Pressable>

  );
}