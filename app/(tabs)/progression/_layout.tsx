import NavBar from "@/components/NavBar";
import StatusBar from "@/components/shared/StatusBar";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  return (
    <View className="bg-primary h-full">
      <StatusBar />
      <NavBar />
      <Stack initialRouteName="ProgressionHomePage" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000000' } }}>
        <Stack.Screen name="ProgressionHomePage" />
        <Stack.Screen name="ExerciseProgressionList" />
        <Stack.Screen name="ExerciseProgressionPage" />
        <Stack.Screen name="WorkoutProgressionList" />
        <Stack.Screen name="WorkoutProgressionPage" />
      </Stack>
    </View>
  );
}