import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView className="bg-primary h-full">
      <Tabs
        initialRouteName='dashboard'
        screenOptions={{
          // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarStyle: {
            borderTopWidth: 0,
          },
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarInactiveBackgroundColor: 'black',
          tabBarActiveBackgroundColor: 'black'
        }}>
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="workout"
          options={{
            title: 'Workout',
            tabBarIcon: ({ color }) => <FontAwesome6 name="dumbbell" size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="progression"
          options={{
            title: 'Progression',
            tabBarIcon: ({ color }) => <FontAwesome6 name="chart-line" size={20} color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
