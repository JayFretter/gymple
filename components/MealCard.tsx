import { Meal } from "@/interfaces/Meal";
import { View, Text, Pressable } from "react-native";
import { format } from "date-fns";
import MacroBars from "./shared/MacroBars";
import { router } from "expo-router";

const DATE_FORMAT = "MMM d, yyyy h:mm a";

export interface MealCardProps {
  meal: Meal;
  className?: string;
}

function sumMacros(foods: Meal["foods"]): { protein: number; carbs: number; fats: number; calories: number } {
  return foods.reduce(
    (acc, food) => ({
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fats: acc.fats + food.fats,
      calories: acc.calories + food.calories,
    }),
    { protein: 0, carbs: 0, fats: 0, calories: 0 }
  );
}

export default function MealCard({ meal, className }: MealCardProps) {
  const { protein, carbs, fats, calories } = sumMacros(meal.foods);

  return (
    <Pressable
      className={`bg-card rounded-lg p-4 items-center ${className ?? ''}`}
      onPress={() => router.push({ pathname: '/meals/TrackMealPage', params: { mealId: meal.id } })}
    >
      <View className="flex-row items-center justify-between w-full">
        <View className="flex-[1.5]">
          <Text className="text-txt-primary font-bold text-base mb-0.5">{meal.title}</Text>
          <Text className="text-txt-secondary text-xs mb-2">
            {format(new Date(meal.timestamp), DATE_FORMAT)}
          </Text>
          <Text className="text-txt-secondary text-xs mt-1">{Math.round(calories)} kcal</Text>
          {meal.foods.length > 0 && (
            <View className="mt-2">
              {meal.foods.map((food) => (
                <Text key={food.id} className="text-txt-secondary text-xs">
                  {food.name} ({food.gramsUsed}g)
                </Text>
              ))}
            </View>
          )}
        </View>
        <MacroBars
          protein={protein}
          carbs={carbs}
          fats={fats}
          className="flex-1"
        />
      </View>
    </Pressable>
  );
}
