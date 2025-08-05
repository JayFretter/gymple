import { Meal } from "@/interfaces/Meal";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";

export interface MealCardProps {
  meal: Meal;
  className?: string;
}

export default function MealCard({ meal, className }: MealCardProps) {
  const macros = [
    { value: meal.protein, color: '#3b82f6', label: 'Protein' },
    { value: meal.carbs, color: '#f59e42', label: 'Carbs' },
    { value: meal.fats, color: '#ef4444', label: 'Fats' },
  ];
  const chartData = macros.filter(m => m.value > 0);

  return (
    <View className={`bg-card rounded-xl p-4 items-center ${className ?? ''}`}>
      <Text className="text-txt-primary font-bold text-lg mb-2">{meal.title}</Text>
      <PieChart
        data={chartData}
        donut
        radius={60}
        innerRadius={50}
        innerCircleColor={'#181818'}
        centerLabelComponent={() => (
          <Text className="text-txt-secondary text-base font-semibold">{meal.calories} kcal</Text>
        )}
      />
      <View className="flex-row gap-4 mt-4">
        {chartData.map((macro, idx) => (
          <View key={idx} className="flex-row items-center gap-1">
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: macro.color }} />
            <Text className="text-txt-secondary text-sm">{macro.label}: {macro.value}g</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
