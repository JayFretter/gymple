import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack initialRouteName="CreateWorkoutPage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateWorkoutPage" />
      <Stack.Screen name="ViewWorkoutPage" />
    </Stack>
  );
}