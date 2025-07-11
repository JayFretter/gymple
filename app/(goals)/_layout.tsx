import NavBar from "@/components/NavBar";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
      <SafeAreaView className="bg-gray-200 h-full">
        <NavBar />
        <Stack initialRouteName="ListGoalsPage" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ListGoalsPage" />
          <Stack.Screen name="EditGoalPage" />
        </Stack>
      </SafeAreaView>
  );
}