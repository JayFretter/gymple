import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import notifee, { EventType } from '@notifee/react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

import { ThemeProvider } from '@/components/ui/ThemeProvider';
import "../global.css";

import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

SystemUI.setBackgroundColorAsync("black");

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  
});

// export const unstable_settings = {
//   // Ensure any route can link back to `/`
//   initialRouteName: '(tabs)',
// };

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    SquadaOne: require('../assets/fonts/SquadaOne-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      // router.replace('/(tabs)/dashboard');
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <GestureHandlerRootView>
        <Stack 
          screenOptions={{contentStyle: { backgroundColor: '#000000' }}}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* <Stack.Screen name="(exercises)" options={{ headerShown: false }} /> */}
          {/* <Stack.Screen name="(goals)" options={{ headerShown: false }} /> */}
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </GestureHandlerRootView>

    </ThemeProvider>
  );
}
