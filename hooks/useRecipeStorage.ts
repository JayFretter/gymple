import { storage } from "@/storage";
import { SavedMeal } from "@/interfaces/SavedMeal";

const SAVED_MEALS_KEY = "data_saved_meals";

export default function useSavedMealStorage() {
  const fetchSavedMeals = (): SavedMeal[] => {
    const savedMealsString = storage.getString(SAVED_MEALS_KEY);
    return savedMealsString ? JSON.parse(savedMealsString) as SavedMeal[] : [];
  };

  const addSavedMeal = (savedMeal: SavedMeal): void => {
    const savedMeals = fetchSavedMeals();
    savedMeals.push(savedMeal);
    storage.set(SAVED_MEALS_KEY, JSON.stringify(savedMeals));
  };

  const setSavedMeals = (savedMeals: SavedMeal[]): void => {
    storage.set(SAVED_MEALS_KEY, JSON.stringify(savedMeals));
  };

  const toggleFavourite = (savedMealId: string): void => {
    const savedMeals = fetchSavedMeals();
    const updated = savedMeals.map(r =>
      r.id === savedMealId ? { ...r, isFavourite: !r.isFavourite } : r
    );
    setSavedMeals(updated);
  };

  return { fetchSavedMeals, addSavedMeal, setSavedMeals, toggleFavourite };
}
