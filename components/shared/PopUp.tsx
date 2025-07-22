import React, { useEffect } from 'react';
import { View, TouchableWithoutFeedback, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
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
    transform: [{ scale: withSpring(scale.value, {duration: 300}) }],
    opacity: scale.value,
  }));

  if (!visible) return null;

  return (
    <LinearGradient
      className="absolute inset-0 z-20 bg-[#000000CC] flex justify-center items-center"
      colors={['#111111', '#11111100']}
    >
      <Animated.View
        style={animatedStyle}
        className="bg-primary rounded-lg p-6 w-[90%] shadow-lg border border-gray-700"
      >
        {children}
        <GradientPressable className='mt-4' style='default' onPress={onClose}>
          <Text className='text-white font-semibold px-2 py-2 text-center' >{closeButtonText ?? 'Close'}</Text>
        </GradientPressable>
      </Animated.View>
    </LinearGradient>
  );
}