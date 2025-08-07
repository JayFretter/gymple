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
import { DistanceUnit } from '@/enums/distance-unit';
import { useColorScheme } from 'nativewind';

export default function SettingsPage() {
  const [getUserPreferences] = useUserPreferences();
  const [initialUserPreferences, setInitialUserPreferences] = useState<UserPreferences>();

  const [weightUnit, setWeightUnit] = useState<WeightUnit>(WeightUnit.KG);
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(DistanceUnit.KM);
  const [colourScheme, setColourScheme] = useState<'light' | 'dark' | 'system'>('system');
  const [defaultRestTimerTotalSeconds, setDefaultRestTimerTotalSeconds] = useState(90);

  const appColours = useColorScheme();

  useEffect(() => {
    const preferences = getUserPreferences();
    setInitialUserPreferences(preferences);
    setWeightUnit(preferences.weightUnit);
    setDistanceUnit(preferences.distanceUnit);
    setColourScheme(preferences.colourScheme);
    setDefaultRestTimerTotalSeconds(preferences.defaultRestTimerDurationSeconds);
  }, []);

  const savePreferences = () => {
    const updatedPreferences = { ...initialUserPreferences, weightUnit, distanceUnit, colourScheme, defaultRestTimerDurationSeconds: defaultRestTimerTotalSeconds };
    storage.set('data_user_preferences', JSON.stringify(updatedPreferences));
    appColours.setColorScheme(colourScheme);

    router.back();
  };

  return (
    <View className="flex-1 bg-primary p-4">
      <Text className="text-txt-primary text-4xl font-bold mb-4">Settings</Text>
      
      <Text className="text-txt-secondary text-lg">Preferred weight unit</Text>
      <ToggleList
        className='mt-2'
        options={[WeightUnit.KG, WeightUnit.LBS]}
        initialOption={weightUnit}
        onOptionSelected={(unit) => setWeightUnit(unit as WeightUnit)}
      />
      <Text className="text-txt-secondary text-lg mt-4">Preferred distance unit</Text>
      <ToggleList
        className='mt-2'
        options={[DistanceUnit.KM, DistanceUnit.MI]}
        initialOption={distanceUnit}
        onOptionSelected={(unit) => setDistanceUnit(unit as DistanceUnit)}
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