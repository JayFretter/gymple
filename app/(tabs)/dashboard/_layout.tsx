import NavBar from "@/components/NavBar";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="EditGoalPage" />
        <Stack.Screen name="ListGoalsPage" />
      </Stack>
    </SafeAreaView>
  );
}