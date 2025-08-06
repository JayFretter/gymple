import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      if (onLoginSuccess) onLoginSuccess();
      console.log('Login successful');
    } catch (err: any) {
      setError("Couldn't log in. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full">
      <Text className="text-txt-primary text-3xl font-bold mb-8">Login</Text>
      <TextInput
        className="bg-card text-txt-primary w-full mb-4 p-3 rounded-lg"
        placeholder="Email"
        placeholderTextColor="#888"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="bg-card text-txt-primary w-full mb-6 p-3 rounded-lg"
        placeholder="Password"
        placeholderTextColor="#888"
        autoCapitalize='none'
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error && <Text className="text-red-300 mb-4">{error}</Text>}
      <Pressable
        className="bg-highlight px-8 py-3 rounded-lg w-full items-center"
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white text-lg font-semibold">{loading ? 'Logging in...' : 'Login'}</Text>
      </Pressable>
    </View>
  );
}
