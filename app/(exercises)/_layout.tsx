import NavBar from "@/components/NavBar";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
      <SafeAreaView className="bg-gray-200 h-full">
        <NavBar />
        <Stack initialRouteName="CreateExercisePage" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="CreateExercisePage" />
          <Stack.Screen name="SelectExercisePage" />
          <Stack.Screen name="TrackExercisePage" />
        </Stack>
      </SafeAreaView>
  );
}