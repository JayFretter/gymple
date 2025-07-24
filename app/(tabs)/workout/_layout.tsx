import NavBar from "@/components/NavBar";
import StatusBar from "@/components/shared/StatusBar";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  return (
    <View className="bg-primary h-full">
      <StatusBar />
      <NavBar />
      <Stack initialRouteName="WorkoutsPage" screenOptions={{ headerShown: false, contentStyle: {backgroundColor: '#000000'} }}>
        <Stack.Screen name="WorkoutsPage" />
        <Stack.Screen name="CreateWorkoutPage" />
        <Stack.Screen name="ViewWorkoutPage" />
        <Stack.Screen name="TrackExercisePage" />
        <Stack.Screen name="WorkoutCompletedPage" />
      </Stack>
    </View>
  );
}