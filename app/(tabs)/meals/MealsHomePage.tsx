import MealList from "@/components/shared/MealList";
import GradientPressable from "@/components/shared/GradientPressable";
import MealSummaryChart from "@/components/shared/MealSummaryChart";
import useMealStorage from "@/hooks/useMealStorage";
import { Meal } from "@/interfaces/Meal";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";


function getStartOfDayTimestamp(timestamp: number): number {
  const now = new Date(timestamp);
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

function getEndOfDayTimestamp(timestamp: number): number {
  const now = new Date(timestamp);
  now.setHours(23, 59, 59, 999);
  return now.getTime();
}

export default function MealsHomePage() {
  const router = useRouter();
  const { fetchMeals } = useMealStorage();
  const [meals, setMeals] = useState<Meal[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const today = Date.now();
      const start = getStartOfDayTimestamp(today);
      const end = getEndOfDayTimestamp(today);
      const meals = fetchMeals().filter(meal => meal.timestamp >= start && meal.timestamp <= end);
      setMeals(meals);
    }
  }, [isFocused]);

  const handleTrackMeal = () => {
    router.push("/meals/TrackMealPage");
  };

  return (
    <View className="flex-1 bg-primary px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-4xl font-bold self-start text-txt-primary mt-4">Meals</Text>
        <View className="flex-row items-center gap-2 mt-8">
          <Text className="text-2xl font-semibold self-start text-txt-secondary">Today's Summary</Text>
          <Feather name="bar-chart-2" size={24} color="#aaaaaa" />
        </View>
        <MealSummaryChart className="" meals={meals} />
        <Text className="text-2xl font-semibold self-start text-txt-secondary mt-8">Today's Meals</Text>
        <GradientPressable
          className="mt-4"
          style='default'
          onPress={handleTrackMeal}
        >
          <View className="flex-row items-center justify-center gap-2 p-2">
            <AntDesign name="plus" size={14} color="white" />
            <Text className="text-txt-primary text-center font-bold">Add Meal</Text>
          </View>
        </GradientPressable>
        <MealList
          className="mt-4"
          meals={meals}
        />

      </ScrollView>
    </View>
  );
}