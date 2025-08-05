import { Meal } from "@/interfaces/Meal";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { format } from "date-fns";

const DATE_FORMAT = "MMM d, yyyy h:mm a";

export interface MealCardProps {
  meal: Meal;
  className?: string;
}

export default function MealCard({ meal, className }: MealCardProps) {
  const macros = [
    { value: meal.protein, color: '#D51F31', label: 'Protein' },
    { value: meal.carbs, color: '#419159', label: 'Carbs' },
    { value: meal.fats, color: '#F0B953', label: 'Fats' },
  ];
  const chartData = macros.filter(m => m.value > 0);

  return (
    <View className={`bg-card rounded-xl p-4 items-center ${className ?? ''}`}>
      <Text className="text-txt-primary font-bold text-lg">{meal.title}</Text>
      <Text className="text-txt-secondary text-xs mb-4">
        {format(new Date(meal.timestamp), DATE_FORMAT)}
      </Text>
      <PieChart
        data={chartData}
        donut
        radius={50}
        innerRadius={40}
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
