import React, { createContext, useContext, useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface ModalContextType {
  showModal: (content: React.ReactNode) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const screenHeight = Dimensions.get('window').height;
  const translateY = useSharedValue(screenHeight);

  useEffect(() => {
    if (modalContent) {
      translateY.value = withTiming(0, { duration: 350 });
    } else {
      translateY.value = withTiming(screenHeight, { duration: 350 });
    }
  }, [modalContent, screenHeight, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const showModal = (content: React.ReactNode) => setModalContent(content);
  const hideModal = () => setModalContent(null);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalContent && (
        <View className="absolute inset-0 z-50 bg-[#111111EE] flex items-center justify-center">
          <Animated.View style={animatedStyle} className="w-full flex items-center justify-center">
            {modalContent}
          </Animated.View>
        </View>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
}