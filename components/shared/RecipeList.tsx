import { Recipe } from "@/interfaces/Recipe";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface RecipeListProps {
  recipes: Recipe[];
  onSelect: (recipe: Recipe) => void;
  onToggleFavourite?: (recipe: Recipe) => void;
}

export function RecipeList({ recipes, onSelect, onToggleFavourite }: RecipeListProps) {
  // Sort: favourites first
  const sortedRecipes = [...recipes].sort((a, b) => {
    if (a.isFavourite === b.isFavourite) return 0;
    return a.isFavourite ? -1 : 1;
  });
  return (
    <View className="w-full">
      {sortedRecipes.length === 0 ? (
        <Text className="text-txt-secondary text-center mt-4">No recipes saved yet.</Text>
      ) : (
        sortedRecipes.map(recipe => (
          <View key={recipe.id} className="bg-tertiary rounded-lg p-4 mb-2 flex-row items-center justify-between">
            <TouchableOpacity
              className="flex-1"
              onPress={() => onSelect(recipe)}
            >
              <Text className="text-lg font-bold text-txt-primary">{recipe.title}</Text>
              <Text className="text-xs text-txt-secondary mt-1">
                {recipe.protein}g P / {recipe.carbs}g C / {recipe.fats}g F / {recipe.calories} kcal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="ml-4"
              onPress={() => onToggleFavourite && onToggleFavourite(recipe)}
              accessibilityLabel={recipe.isFavourite ? 'Unfavourite' : 'Favourite'}
            >
              <Ionicons
                name={recipe.isFavourite ? 'star' : 'star-outline'}
                size={24}
                color={recipe.isFavourite ? '#FFD700' : '#888'}
              />
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
}
