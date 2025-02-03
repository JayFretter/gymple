import NavBar from "@/components/NavBar";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <SafeAreaView className="bg-slate-900 h-full">
      <NavBar />
      <Stack initialRouteName="CreateWorkoutPage" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CreateWorkoutPage" />
        <Stack.Screen name="ViewWorkoutPage" />
      </Stack>
    </SafeAreaView>
  );
}