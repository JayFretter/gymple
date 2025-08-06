import { View, Text } from "react-native";
import { SavedMealList } from "./RecipeList";
import { SavedMeal } from "@/interfaces/SavedMeal";
import GradientPressable from "./GradientPressable";
import { useModal } from "../ModalProvider";
import { useState } from "react";
import useSavedMealStorage from "@/hooks/useRecipeStorage";

export interface SavedMealModalProps {
  onSelect?: (savedMeal: SavedMeal) => void;
}

export default function SavedMealModal({ onSelect }: SavedMealModalProps) {
  const { hideModal } = useModal();
  const { fetchSavedMeals, toggleFavourite } = useSavedMealStorage();
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>(() => fetchSavedMeals());
  const sortedSavedMeals = [...savedMeals].sort((a, b) => (b.isFavourite ? 1 : 0) - (a.isFavourite ? 1 : 0));
  
  const handleToggleFavourite = (savedMeal: SavedMeal) => {
    toggleFavourite(savedMeal.id);
    setSavedMeals(fetchSavedMeals());
  };

  const handleMealSelected = (savedMeal: SavedMeal) => {
    onSelect?.(savedMeal);
    hideModal();
  }

  return (
    <View className="bg-card rounded-xl p-4 max-h-[80%] w-[95%]">
      <Text className="text-xl font-bold text-txt-primary mb-4">Pick a Saved Meal</Text>
      <SavedMealList
        savedMeals={sortedSavedMeals}
        onSelect={handleMealSelected}
        onToggleFavourite={handleToggleFavourite}
      />
      <GradientPressable className="mt-4" style="default" onPress={hideModal}>
        <Text className="text-txt-primary text-center font-semibold my-2">Close</Text>
      </GradientPressable>
    </View>
  )
}