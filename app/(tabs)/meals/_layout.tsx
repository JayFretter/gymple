import NavBar from "@/components/NavBar";
import StatusBar from "@/components/shared/StatusBar";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  return (
    <View className="bg-primary h-full">
      <StatusBar />
      <Stack
        initialRouteName="MealsHomePage"
        screenOptions={{
          contentStyle: {
            backgroundColor: "transparent",
          },
          headerShown: true,
          header: (props) => <NavBar {...props} />,
        }}
      >
        <Stack.Screen name="MealsHomePage" />
        <Stack.Screen name="TrackMealPage" />
        <Stack.Screen name="NutritionTargetsPage" />
        <Stack.Screen name="BarcodeScannerPage" />
      </Stack>
    </View>
  );
}