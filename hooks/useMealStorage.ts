import { storage } from "@/storage";
import { Meal } from "@/interfaces/Meal";

const MEALS_KEY = "data_meals";

export default function useMealStorage() {
  const fetchMeals = (): Meal[] => {
    const mealsString = storage.getString(MEALS_KEY);
    return mealsString ? JSON.parse(mealsString) as Meal[] : [];
  };

  const addMeal = (meal: Meal): void => {
    const meals = fetchMeals();
    meals.push(meal);
    storage.set(MEALS_KEY, JSON.stringify(meals));
  };

  const setMeals = (meals: Meal[]): void => {
    storage.set(MEALS_KEY, JSON.stringify(meals));
  };

  return { fetchMeals, addMeal, setMeals };
}
