import useUserPreferences from "@/hooks/useUserPreferences";
import { Meal } from "@/interfaces/Meal";
import UserPreferences from "@/interfaces/UserPreferences";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

const MIN_BAR_HEIGHT_PERCENTAGE = 1;

interface MealSummaryChartProps {
  className?: string;
  meals: Meal[]; // Optional prop to pass meals directly
}

export default function MealSummaryChart({ className, meals }: MealSummaryChartProps) {
  const [totalMacros, setTotalMacros] = useState<{ protein: number; carbs: number; fats: number }>({ protein: 0, carbs: 0, fats: 0 });
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [getUserPreferences] = useUserPreferences();
  const nutritionTargets = (() => {
    const prefs: UserPreferences = getUserPreferences();
    return prefs.nutritionTargets || {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fats: 60
    };
  })();

  useEffect(() => {
    const macros = meals.reduce((acc, meal) => ({
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats
    }), { protein: 0, carbs: 0, fats: 0 });
    setTotalMacros(macros);
    setTotalCalories(meals.reduce((acc, meal) => acc + meal.calories, 0));
  }, [meals]);

  const macroData = [
    { value: totalMacros.protein, label: "Protein", color: "#D51F31" },
    { value: totalMacros.carbs, label: "Carbs", color: "#419159" },
    { value: totalMacros.fats, label: "Fats", color: "#F0B953" }
  ];

  return (
    <View className={className + ' w-full items-center'}>
      {/* <Text className="text-txt-primary text-lg font-bold">Today</Text> */}
      <View className="flex-row w-full justify-between items-end mt-4 mb-4 gap-4">
        {/* Calories Bar */}
        <View className="items-center flex-1">
          <View className="h-24 w-8 bg-card rounded-xl overflow-hidden flex-col justify-end relative">
            <View
              className="absolute left-0 bottom-0 w-full"
              style={{
                height: `${Math.max(Math.min(100, (totalCalories / nutritionTargets.calories) * 100), MIN_BAR_HEIGHT_PERCENTAGE)}%`,
                backgroundColor: '#2a53b5',
              }}
            />
          </View>
          <Text className="text-xs font-bold mt-2 text-txt-secondary">Calories</Text>
          <Text className="text-xs text-txt-primary">
            <Text className={totalCalories > nutritionTargets.calories ? "text-red-400" : ""}>{totalCalories}</Text>
            <Text> / {nutritionTargets.calories}</Text>
          </Text>
        </View>
        {/* Macro Bars */}
        {macroData.map(macro => {
          const target = nutritionTargets[macro.label.toLowerCase() as keyof typeof nutritionTargets] || 0;
          const percent = Math.min(100, (macro.value / target) * 100);
          return (
            <View key={macro.label} className="items-center flex-1">
              <View className="h-24 w-8 bg-card rounded-xl overflow-hidden flex justify-end relative">
                <View
                  className="absolute left-0 bottom-0 w-full"
                  style={{
                    height: `${Math.max(percent, MIN_BAR_HEIGHT_PERCENTAGE)}%`,
                    backgroundColor: macro.color,
                  }}
                />
              </View>
              <Text className="text-xs font-bold mt-2" style={{ color: macro.color }}>{macro.label}</Text>
              <Text className="text-xs text-txt-primary">
                <Text className={macro.value > target ? "text-red-400" : ""}>{macro.value}g</Text>
                <Text> / {target}g</Text>
              </Text>
            </View>
          );
        })}
      </View>
      <Pressable className="flex-row items-center gap-1" onPress={() => router.push("/meals/NutritionTargetsPage")}>
        <Ionicons name="settings-sharp" size={10} color="#555555" />
        <Text className="text-txt-tertiary text-sm">Adjust targets</Text>
      </Pressable>
      {meals.length === 0 && (
        <Text className="text-txt-secondary text-sm mt-2">No meals logged.</Text>
      )}
    </View>
  );
}
