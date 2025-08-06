import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Pressable } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

interface SignUpScreenProps {
  onSignUpSuccess?: () => void;
}

export default function SignUpScreen({ onSignUpSuccess }: SignUpScreenProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(getAuth(), email, password).then(cred => {
        firestore()
          .collection('users')
          .doc(cred.user.uid)
          .set({
            isPlusUser: false,
          });
      });


      if (onSignUpSuccess) onSignUpSuccess();
      console.log('Sign up successful');
    } catch (err: any) {
      setError("Couldn't sign up. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full">
      <Text className="text-txt-primary text-3xl font-bold mb-8">Sign Up</Text>
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
        className="bg-card text-txt-primary w-full mb-4 p-3 rounded-lg"
        placeholder="Password"
        placeholderTextColor="#888"
        autoCapitalize='none'
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        className="bg-card text-txt-primary w-full mb-6 p-3 rounded-lg"
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        autoCapitalize='none'
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {error && <Text className="text-red-300 mb-4">{error}</Text>}
      <Pressable
        className="bg-highlight px-8 py-3 rounded-lg w-full items-center"
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text className="text-white text-lg font-semibold">{loading ? 'Signing up...' : 'Sign Up'}</Text>
      </Pressable>
    </View>
  );
}
