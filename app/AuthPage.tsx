import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleSwitchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <View className="flex-1 bg-primary justify-center items-center px-4">
      {mode === 'login' ? <LoginScreen /> : <SignUpScreen />}
      <Pressable className="mt-8" onPress={handleSwitchMode}>
        <Text className="text-txt-primary underline text-base">
          {mode === 'login'
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </Text>
      </Pressable>
    </View>
  );
}