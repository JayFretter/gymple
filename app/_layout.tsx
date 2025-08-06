import notifee from '@notifee/react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import "../global.css";
import { ModalProvider } from '@/components/ModalProvider';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import LoginScreen from '@/components/shared/LoginScreen';
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

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function handleAuthStateChanged(user: any) {
    console.log("Auth state changed:", user);
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      // router.replace('/(tabs)/dashboard');
    }
  }, [loaded]);

  if (!loaded || initializing) {
    return null;
  }

  // If user is not authenticated, show login screen
  if (!user) {
    return (
      <ThemeProvider>
        <GestureHandlerRootView>
          <LoginScreen />
        </GestureHandlerRootView>
      </ThemeProvider>
    );
  }

  // If authenticated, show app stack
  return (
    <ThemeProvider>
      <GestureHandlerRootView>
        <ModalProvider>
          <Stack
            screenOptions={{ contentStyle: { backgroundColor: '#000000' } }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="(exercises)" options={{ headerShown: false }} /> */}
            {/* <Stack.Screen name="(goals)" options={{ headerShown: false }} /> */}
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ModalProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
