import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import useThemeColours from '@/hooks/useThemeColours';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import BgView from '@/components/shared/BgView';

export default function TabLayout() {
  const themeColour = useThemeColours();

  return (
    <SafeAreaView className="flex-1">
      <BgView>
        <Tabs
          initialRouteName='dashboard'
          screenOptions={{
            sceneStyle: {
              backgroundColor: 'transparent',
            },
            tabBarStyle: {
              borderTopWidth: 0,
            },
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarInactiveBackgroundColor: themeColour('navbar'),
            tabBarActiveBackgroundColor: themeColour('primary'),
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
          <Tabs.Screen
            name="meals"
            options={{
              title: 'Meals',
              tabBarIcon: ({ color }) => <MaterialCommunityIcons name="silverware-fork-knife" size={22} color={color} />,
            }}
          />
        </Tabs>
      </BgView>
    </SafeAreaView>
  );
}
