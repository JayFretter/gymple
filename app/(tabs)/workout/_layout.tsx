import NavBar from "@/components/NavBar";
import StatusBar from "@/components/shared/StatusBar";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  return (
    <View className="bg-primary h-full">
      <StatusBar />
      <Stack
        initialRouteName="WorkoutsPage"
        screenOptions={{
          headerShown: true,
          header: (props) => <NavBar {...props} />,
        }}
      >
        <Stack.Screen name="WorkoutsPage" />
        <Stack.Screen name="CreateWorkoutPage" />
        <Stack.Screen name="ViewWorkoutPage" />
        <Stack.Screen name="TrackExercisePage" />
        <Stack.Screen name="TrackCardioPage" />
        <Stack.Screen name="WorkoutCompletedPage" options={{headerShown: false}} />
      </Stack>
    </View>
  );
}