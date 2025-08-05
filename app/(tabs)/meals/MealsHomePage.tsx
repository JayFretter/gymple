import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import useMealStorage from "@/hooks/useMealStorage";
import MealCard from "@/components/MealCard";
import { Meal } from "@/interfaces/Meal";
import { useIsFocused } from "@react-navigation/native";
import TodaysMealSummary from "@/components/shared/TodaysMealSummary";
import GradientPressable from "@/components/shared/GradientPressable";

export default function MealsHomePage() {
  const router = useRouter();
  const { fetchMeals } = useMealStorage();
  const [meals, setMeals] = useState<Meal[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setMeals(fetchMeals());
    }
  }, [isFocused]);

  const handleTrackMeal = () => {
    router.push("/meals/TrackMealPage");
  };

  return (
    <View className="flex-1 bg-primary px-4">
      <View className="items-center justify-center mt-8 mb-6">
        <Text className="text-4xl font-bold self-start text-txt-primary mb-6">Meals</Text>
        <GradientPressable
          className="self-end"
          style='default'
          onPress={handleTrackMeal}
        >
          <Text className="text-txt-primary font-bold mx-2 my-2">Track a Meal</Text>
        </GradientPressable>
        <TodaysMealSummary className="mt-4" />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {meals.length === 0 ? (
          <Text className="text-txt-secondary text-center mt-12">No meals tracked yet.</Text>
        ) : (
          meals.map((meal, idx) => (
            <MealCard key={meal.id ?? idx} meal={meal} className="mb-6" />
          ))
        )}
      </ScrollView>
    </View>
  );
}