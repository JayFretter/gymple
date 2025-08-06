import { storage } from "@/storage";
import { Recipe } from "@/interfaces/Recipe";

const RECIPES_KEY = "data_recipes";

export default function useRecipeStorage() {
  const fetchRecipes = (): Recipe[] => {
    const recipesString = storage.getString(RECIPES_KEY);
    return recipesString ? JSON.parse(recipesString) as Recipe[] : [];
  };

  const addRecipe = (recipe: Recipe): void => {
    const recipes = fetchRecipes();
    recipes.push(recipe);
    storage.set(RECIPES_KEY, JSON.stringify(recipes));
  };

  const setRecipes = (recipes: Recipe[]): void => {
    storage.set(RECIPES_KEY, JSON.stringify(recipes));
  };

  const toggleFavourite = (recipeId: string): void => {
    const recipes = fetchRecipes();
    const updated = recipes.map(r =>
      r.id === recipeId ? { ...r, isFavourite: !r.isFavourite } : r
    );
    setRecipes(updated);
  };

  return { fetchRecipes, addRecipe, setRecipes, toggleFavourite };
}
