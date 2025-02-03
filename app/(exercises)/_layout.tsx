import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
      <SafeAreaView className="bg-slate-900 h-full">
        <Stack initialRouteName="CreateExercisePage" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="CreateExercisePage" />
          <Stack.Screen name="SelectExercisePage" />
          <Stack.Screen name="TrackExercisePage" />
        </Stack>
      </SafeAreaView>
  );
}