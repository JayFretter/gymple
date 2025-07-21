import NavBar from "@/components/NavBar";
import StatusBar from "@/components/shared/StatusBar";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <StatusBar />
      <NavBar />
      <Stack initialRouteName="index" screenOptions={{ headerShown: false, contentStyle: {backgroundColor: '#000000'} }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="CreateWorkoutPage" />
        <Stack.Screen name="ViewWorkoutPage" />
        <Stack.Screen name="TrackExercisePage" />
        <Stack.Screen name="WorkoutCompletedPage" />
      </Stack>
    </SafeAreaView>
  );
}