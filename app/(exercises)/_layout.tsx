import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack initialRouteName="CreateExercisePage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateExercisePage" />
      <Stack.Screen name="SelectExercisePage" />
    </Stack>
  );
}