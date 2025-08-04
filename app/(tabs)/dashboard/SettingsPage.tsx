import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import useUserPreferences from '@/hooks/useUserPreferences';
import { storage } from '@/storage';
import { router } from 'expo-router';
import EditableTimer from '@/components/shared/EditableTimer';
import UserPreferences from '@/interfaces/UserPreferences';
import { WeightUnit } from '@/enums/weight-unit';
import GradientPressable from '@/components/shared/GradientPressable';
import ToggleList from '@/components/shared/ToggleList';
import { set } from 'date-fns';

export default function SettingsPage() {
  const [getUserPreferences] = useUserPreferences();
  const [initialUserPreferences, setInitialUserPreferences] = useState<UserPreferences>();

  const [weightUnit, setWeightUnit] = useState<WeightUnit>(WeightUnit.KG);
  const [colourScheme, setColourScheme] = useState<'light' | 'dark' | 'system'>('system');
  const [defaultRestTimerTotalSeconds, setDefaultRestTimerTotalSeconds] = useState(90);

  useEffect(() => {
    const preferences = getUserPreferences();
    console.log('Initial user preferences:', preferences);
    setInitialUserPreferences(preferences);
    setWeightUnit(preferences.weightUnit);
    setColourScheme(preferences.colourScheme);
    setDefaultRestTimerTotalSeconds(preferences.defaultRestTimerDurationSeconds);
  }, []);

  const savePreferences = () => {
    const updatedPreferences = { weightUnit, colourScheme, defaultRestTimerDurationSeconds: defaultRestTimerTotalSeconds };
    storage.set('data_user_preferences', JSON.stringify(updatedPreferences));

    router.back();
  };

  return (
    <View className="flex-1 bg-primary p-4">
      <Text className="text-txt-primary text-4xl font-bold mb-4">Settings</Text>
      
      <Text className="text-txt-secondary text-lg mb-2">Preferred weight unit</Text>
      <ToggleList
        options={[WeightUnit.KG, WeightUnit.LBS]}
        initialOption={weightUnit}
        onOptionSelected={(unit) => setWeightUnit(unit as WeightUnit)}
      />
      <Text className="text-txt-secondary text-lg mb-2 mt-4">Color scheme</Text>
      <ToggleList
        options={['light', 'dark', 'system']}
        initialOption={colourScheme}
        onOptionSelected={(colour) => setColourScheme(colour as 'light' | 'dark' | 'system')}
      />
      <Text className="text-txt-secondary text-lg mb-2 mt-4">Default rest timer duration</Text>
      <EditableTimer
        onTimeChanged={setDefaultRestTimerTotalSeconds}
        initialTimeInSeconds={initialUserPreferences?.defaultRestTimerDurationSeconds}
      />
      <GradientPressable
        style='green'
        className="w-full mt-8"
        onPress={savePreferences}
      >
        <Text className="text-white text-center font-semibold my-2">Save</Text>
      </GradientPressable>

      
    </View>
  );
};