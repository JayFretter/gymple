import useMealStorage from "@/hooks/useMealStorage";
import { Meal } from "@/interfaces/Meal";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import useUserPreferences from "@/hooks/useUserPreferences";
import UserPreferences from "@/interfaces/UserPreferences";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface TodaysMealSummaryProps {
  className?: string;
}

function getStartOfDayTimestamp(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

function getEndOfDayTimestamp(): number {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return now.getTime();
}

export default function TodaysMealSummary({ className }: TodaysMealSummaryProps) {
  const { fetchMeals } = useMealStorage();
  const [todaysMeals, setTodaysMeals] = useState<Meal[]>([]);
  const [totalMacros, setTotalMacros] = useState<{ protein: number; carbs: number; fats: number }>({ protein: 0, carbs: 0, fats: 0 });
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const isFocused = useIsFocused();
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
    const start = getStartOfDayTimestamp();
    const end = getEndOfDayTimestamp();
    const meals = fetchMeals().filter(meal => meal.timestamp >= start && meal.timestamp <= end);
    setTodaysMeals(meals);
    const macros = meals.reduce((acc, meal) => ({
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats
    }), { protein: 0, carbs: 0, fats: 0 });
    setTotalMacros(macros);
    setTotalCalories(meals.reduce((acc, meal) => acc + meal.calories, 0));
  }, [isFocused]);

  const macroData = [
    { value: totalMacros.protein, label: "Protein", color: "#D51F31" },
    { value: totalMacros.carbs, label: "Carbs", color: "#419159" },
    { value: totalMacros.fats, label: "Fats", color: "#F0B953" }
  ];

  const totalMacroValue = totalMacros.protein + totalMacros.carbs + totalMacros.fats;

  return (
    <View className={className + ' w-full bg-card rounded-lg p-4 items-center'}>
      <View className="flex-row items-center w-full justify-between">
        <Ionicons className="opacity-0" name="settings-sharp" size={20} color="white" />
        <Text className="text-txt-primary text-lg font-bold">Today's Summary</Text>
        <Pressable className="self-end" onPress={() => router.push("/meals/NutritionTargetsPage")}>
          <Ionicons name="settings-sharp" size={20} color="#aaaaaa" />
        </Pressable>
      </View>
      <View className="flex-row w-full justify-between items-end mt-4 mb-4 gap-4">
        {/* Calories Bar */}
        <View className="items-center flex-1">
          <View className="h-24 w-8 rounded-md overflow-hidden flex-col justify-end relative">
            <View
              className="absolute left-0 bottom-0 w-full rounded-md"
              style={{ height: `${Math.min(100, (totalCalories / nutritionTargets.calories) * 100)}%`, backgroundColor: '#2a53b5' }}
            />
            <View
              className="absolute left-0 top-0 w-full bg-[#333333] rounded-md"
              style={{ height: `${100 - Math.min(100, (totalCalories / nutritionTargets.calories) * 100)}%` }}
            />
          </View>
          <Text className="text-xs font-bold mt-2 text-txt-secondary">Calories</Text>
          <Text className="text-xs text-txt-primary">{totalCalories} / {nutritionTargets.calories}</Text>
        </View>
        {/* Macro Bars */}
        {macroData.map(macro => {
          const target = nutritionTargets[macro.label.toLowerCase() as keyof typeof nutritionTargets] || 0;
          const percent = Math.min(100, (macro.value / target) * 100);
          return (
            <View key={macro.label} className="items-center flex-1">
              <View className="h-24 w-8 rounded-md overflow-hidden flex-col justify-end relative">
                <View
                  className="absolute left-0 bottom-0 w-full rounded-md"
                  style={{ height: `${percent}%`, backgroundColor: macro.color }}
                />
                <View
                  className="absolute left-0 top-0 w-full bg-[#333333] rounded-md"
                  style={{ height: `${100 - percent}%` }}
                />
              </View>
              <Text className="text-xs font-bold mt-2" style={{ color: macro.color }}>{macro.label}</Text>
              <Text className="text-xs text-txt-primary">{macro.value}g / {target}g</Text>
            </View>
          );
        })}
      </View>
      {todaysMeals.length === 0 && (
        <Text className="text-txt-secondary mt-4">No meals logged today.</Text>
      )}
    </View>
  );
}
