import NavBar from "@/components/NavBar";
import StatusBar from "@/components/shared/StatusBar";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  return (
    <View className="bg-primary h-full">
      <StatusBar />
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: true,
          header: (props) => <NavBar {...props} />,
        }}
      >
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="EditGoalPage" />
        <Stack.Screen name="ListGoalsPage" />
        <Stack.Screen name="SettingsPage" />
        <Stack.Screen name="ListAchievementsPage" />
        <Stack.Screen name="HelpPage" />
      </Stack>
    </View>
  );
}