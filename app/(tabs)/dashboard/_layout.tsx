import NavBar from "@/components/NavBar";
import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <View className="bg-primary h-full">
      <NavBar />
      <Stack initialRouteName="index" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000000' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="EditGoalPage" />
        <Stack.Screen name="ListGoalsPage" />
        <Stack.Screen name="SettingsPage" />
      </Stack>
    </View>
  );
}