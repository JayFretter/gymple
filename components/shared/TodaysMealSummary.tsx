import useMealStorage from "@/hooks/useMealStorage";
import { Meal } from "@/interfaces/Meal";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

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
      <Text className="text-txt-primary text-lg font-bold mb-2">Today's Summary</Text>
      <Text className="text-txt-secondary text-sm mb-4">Total Calories: {totalCalories}</Text>
      <View className={`flex-row w-full h-6 rounded-lg overflow-hidden mb-2 ${totalMacroValue > 0 ? '' : 'opacity-20'}`}>
        {macroData.map(macro => {
          const ratio = totalMacroValue > 0 ? macro.value / totalMacroValue : 1;
          return (
            <View
              key={macro.label}
              style={{
                flex: ratio,
                backgroundColor: macro.color,
                height: '100%'
              }}
            />
          );
        })}
      </View>
      <View className="flex-row w-full justify-between mb-2">
        {macroData.map(macro => (
          <View key={macro.label} className="items-center flex-1">
            <Text className="text-xs font-bold" style={{ color: macro.color }}>{macro.label}</Text>
            <Text className="text-xs text-txt-secondary">{macro.value}g</Text>
          </View>
        ))}
      </View>
      {todaysMeals.length === 0 && (
        <Text className="text-txt-secondary mt-4">No meals logged today.</Text>
      )}
    </View>
  );
}
