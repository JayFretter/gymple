import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import { useColorScheme } from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

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
            tabBarIcon: ({ color }) => <AntDesign name="profile" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="workout"
          options={{
            title: 'Workout',
            tabBarIcon: ({ color }) => <Ionicons name="barbell-outline" size={28} color={color} />,
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
