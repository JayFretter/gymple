import { SavedMeal } from "@/interfaces/SavedMeal";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface SavedMealListProps {
  savedMeals: SavedMeal[];
  onSelect: (savedMeal: SavedMeal) => void;
  onToggleFavourite?: (savedMeal: SavedMeal) => void;
}

export function SavedMealList({ savedMeals, onSelect, onToggleFavourite }: SavedMealListProps) {
  // Sort: favourites first
  const sortedSavedMeals = [...savedMeals].sort((a, b) => {
    if (a.isFavourite === b.isFavourite) return 0;
    return a.isFavourite ? -1 : 1;
  });
  return (
    <View className="w-full">
      {sortedSavedMeals.length === 0 ? (
        <Text className="text-txt-secondary text-center mt-4">No saved meals yet.</Text>
      ) : (
        sortedSavedMeals.map(savedMeal => (
          <View key={savedMeal.id} className="bg-tertiary rounded-lg p-4 mb-2 flex-row items-center justify-between">
            <TouchableOpacity
              className="flex-1"
              onPress={() => onSelect(savedMeal)}
            >
              <Text className="text-lg font-bold text-txt-primary">{savedMeal.title}</Text>
              <Text className="text-xs text-txt-secondary mt-1">
                {savedMeal.foods.map(f => `${f.name} (${f.gramsUsed}g)`).join(", ")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="ml-4"
              onPress={() => onToggleFavourite && onToggleFavourite(savedMeal)}
              accessibilityLabel={savedMeal.isFavourite ? 'Unfavourite' : 'Favourite'}
            >
              <Ionicons
                name={savedMeal.isFavourite ? 'star' : 'star-outline'}
                size={24}
                color={savedMeal.isFavourite ? '#FFD700' : '#888'}
              />
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
}
