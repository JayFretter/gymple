import useUserPreferences from "@/hooks/useUserPreferences";
import { Meal } from "@/interfaces/Meal";
import UserPreferences from "@/interfaces/UserPreferences";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

const MIN_BAR_HEIGHT_PERCENTAGE = 1;

interface MealSummaryChartProps {
  className?: string;
  meals: Meal[];
}

function sumMacrosFromMeals(meals: Meal[]): { protein: number; carbs: number; fats: number; calories: number } {
  return meals.reduce(
    (acc, meal) => meal.foods.reduce(
      (foodAcc, food) => ({
        protein: foodAcc.protein + food.protein,
        carbs: foodAcc.carbs + food.carbs,
        fats: foodAcc.fats + food.fats,
        calories: foodAcc.calories + food.calories,
      }),
      acc
    ),
    { protein: 0, carbs: 0, fats: 0, calories: 0 }
  );
}

export default function MealSummaryChart({ className, meals }: MealSummaryChartProps) {
  const totalMacros = sumMacrosFromMeals(meals);
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
                height: `${Math.max(Math.min(100, (totalMacros.calories / nutritionTargets.calories) * 100), MIN_BAR_HEIGHT_PERCENTAGE)}%`,
                backgroundColor: '#2a53b5',
              }}
            />
          </View>
          <Text className="text-xs font-bold mt-2 text-txt-secondary">Calories</Text>
          <Text className="text-xs text-txt-primary">
            <Text className={totalMacros.calories > nutritionTargets.calories ? "text-red-400" : ""}>{Math.round(totalMacros.calories)}</Text>
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
                <Text className={macro.value > target ? "text-red-400" : ""}>{Math.round(macro.value)}g</Text>
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
