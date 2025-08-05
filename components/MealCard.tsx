import { Meal } from "@/interfaces/Meal";
import { View, Text } from "react-native";
import { format } from "date-fns";

const DATE_FORMAT = "MMM d, yyyy h:mm a";
const MAX_BAR_HEIGHT = 48;

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
  const maxMacroValue = Math.max(...macros.map(m => m.value), 1);

  return (
    <View className={`bg-card rounded-lg p-4 items-center ${className ?? ''}`}>
      <View className="flex-row items-center justify-between w-full">
        <View className="flex-[1.5]">
          <Text className="text-txt-primary font-bold text-base mb-0.5">{meal.title}</Text>
          <Text className="text-txt-secondary text-xs mb-2">
            {format(new Date(meal.timestamp), DATE_FORMAT)}
          </Text>
          <Text className="text-txt-secondary text-xs mt-1">{meal.calories} kcal</Text>
        </View>
        <View className="flex-row flex-1 items-end justify-center">
          {macros.map((macro, idx) => (
            <View key={macro.label} className="items-center flex-1">
              <View
                style={{
                  height: maxMacroValue > 0 ? (macro.value / maxMacroValue) * MAX_BAR_HEIGHT : 0,
                  width: 14,
                  backgroundColor: macro.color,
                  borderRadius: 6,
                  marginBottom: 2,
                }}
              />
              <Text className="text-xs font-bold" style={{ color: macro.color }}>{macro.label}</Text>
              <Text className="text-xs text-txt-primary">{macro.value}g</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
