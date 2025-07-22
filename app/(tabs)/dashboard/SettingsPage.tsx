import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import useUserPreferences from '@/hooks/useUserPreferences';
import { storage } from '@/storage';
import { router } from 'expo-router';

export default function SettingsPage() {
  const [getUserPreferences] = useUserPreferences();
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [colourScheme, setColourScheme] = useState<'light' | 'dark' | 'system'>('system');
  const [defaultRestTimerMinutes, setDefaultRestTimerMinutes] = useState('1');
  const [defaultRestTimerSeconds, setDefaultRestTimerSeconds] = useState('30');

  useEffect(() => {
    const preferences = getUserPreferences();
    setWeightUnit(preferences.weightUnit);
    setColourScheme(preferences.colourScheme);
    setDefaultRestTimerMinutes(Math.floor(preferences.defaultRestTimerDurationSeconds / 60).toString());
    setDefaultRestTimerSeconds((preferences.defaultRestTimerDurationSeconds % 60).toString());
  }, []);

  const savePreferences = () => {
    const defaultRestTimerDurationSeconds = parseInt(defaultRestTimerMinutes) * 60 + parseInt(defaultRestTimerSeconds);

    const updatedPreferences = { weightUnit, colourScheme, defaultRestTimerDurationSeconds };
    storage.set('data_user_preferences', JSON.stringify(updatedPreferences));

    router.back();
  };

  return (
    <View className="flex-1 bg-primary p-4">
      <Text className="text-txt-primary text-4xl font-bold mb-4">Settings</Text>
      
      <Text className="text-txt-secondary text-lg mb-2">Preferred weight unit</Text>
      <TouchableOpacity
        className="bg-card py-2 rounded-lg w-full mb-4 flex-row items-center justify-center gap-1"
        onPress={() => setWeightUnit(weightUnit === 'kg' ? 'lbs' : 'kg')}
      >
        <Text className="text-txt-primary text-center">{weightUnit}</Text>
      </TouchableOpacity>

      <Text className="text-txt-secondary text-lg mb-2">Color scheme</Text>
      <TouchableOpacity
        className="bg-card py-2 rounded-lg w-full mb-4 flex-row items-center justify-center gap-1"
        onPress={() => setColourScheme(colourScheme === 'light' ? 'dark' : 'light')}
      >
        <Text className="text-txt-primary text-center">{colourScheme}</Text>
      </TouchableOpacity>
      
      <Text className="text-txt-secondary text-lg mb-2">Default rest timer duration</Text>
      <View className='flex-row items-center justify-center mb-4'>
        <TextInput className='text-6xl font-semibold text-txt-secondary font-mono bg-card py-4 px-2 rounded-xl' maxLength={2} keyboardType='numeric' value={defaultRestTimerMinutes} onChangeText={setDefaultRestTimerMinutes} />
        <Text className='text-6xl font-semibold text-txt-secondary font-mono'>:</Text>
        <TextInput className='text-6xl font-semibold text-txt-secondary font-mono bg-card py-4 px-2 rounded-xl' maxLength={2} keyboardType='numeric' value={defaultRestTimerSeconds} onChangeText={setDefaultRestTimerSeconds} />
      </View>

      <TouchableOpacity
        className="bg-green-500 py-3 rounded-lg w-full mt-4"
        onPress={savePreferences}
      >
        <Text className="text-white text-center font-semibold">Save Preferences</Text>
      </TouchableOpacity>
    </View>
  );
};