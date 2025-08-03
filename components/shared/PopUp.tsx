import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import GradientPressable from './GradientPressable';

export type PopUpProps = {
  visible: boolean;
  onClose: () => void;
  onCancel?: () => void;
  closeButtonText?: string;
  cancelButtonText?: string;
  children?: React.ReactNode;
  disallowCloseOnBackgroundPress?: boolean;
};

export default function PopUp({ visible, onClose, onCancel, closeButtonText, cancelButtonText, children, disallowCloseOnBackgroundPress = false }: PopUpProps) {
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
    <View
      className='absolute inset-0 z-10 flex items-center justify-center'
    >
        <Pressable
          className='absolute w-full h-full bg-[#111111EE]'
          onPress={disallowCloseOnBackgroundPress ? undefined : onClose}
        />
        <Animated.View
          style={animatedStyle}
          className="bg-primary rounded-lg p-6 w-[90%] border-2 border-card z-20"
        >
          {children}
          <GradientPressable className='mt-4' style='default' onPress={onClose}>
            <Text className='text-white font-semibold px-2 py-2 text-center' >{closeButtonText ?? 'Close'}</Text>
          </GradientPressable>
          {onCancel && (
            <GradientPressable className='mt-2' style='gray' onPress={onCancel}>
              <Text className='text-white font-semibold px-2 py-2 text-center'>{cancelButtonText ?? 'Cancel'}</Text>
            </GradientPressable>
          )}
        </Animated.View>
    </View>

  );
}