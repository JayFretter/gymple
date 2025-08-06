import { Meal } from "@/interfaces/Meal";
import { Text, View } from "react-native";
import MealCard from "../MealCard";

interface MealListProps {
  meals: Meal[];
  className?: string;
}

export default function MealList({ meals, className }: MealListProps) {
  return (
    <View className={className + ' w-full items-center'}>
      {meals.length === 0 ? (
        <Text className="text-txt-secondary text-sm mt-2">No meals logged.</Text>
      ) : (
        meals.map(meal => (
          <MealCard
            key={meal.id}
            meal={meal}
            className="mb-4 w-full"
          />
        ))
      )}
    </View>
  );
}
