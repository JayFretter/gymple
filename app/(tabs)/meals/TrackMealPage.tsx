import { useModal } from "@/components/ModalProvider";
import FoodModal from "@/components/shared/FoodModal";
import GradientPressable from "@/components/shared/GradientPressable";
import { RecipeList } from "@/components/shared/RecipeList";
import ToggleList from "@/components/shared/ToggleList";
import useGetNutritionInfo from "@/hooks/useGetNutritionInfo";
import useMealStorage from "@/hooks/useMealStorage";
import useRecipeStorage from "@/hooks/useRecipeStorage";
import { Food } from "@/interfaces/Food";
import { Meal } from "@/interfaces/Meal";
import { Recipe } from "@/interfaces/Recipe";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import uuid from 'react-native-uuid';

export default function TrackMealPage() {
  const params = useLocalSearchParams();
  const [mode, setMode] = useState<'manual' | 'magic'>('manual');
  const [foods, setFoods] = useState<Food[]>([]);
  const [title, setTitle] = useState<string>('');
  const [protein, setProtein] = useState<string>('');
  const [carbs, setCarbs] = useState<string>('');
  const [fats, setFats] = useState<string>('');
  const [calories, setCalories] = useState<string>('');
  const [mealDescription, setMealDescription] = useState<string>('');
  const router = useRouter();
  const { addMeal } = useMealStorage();
  const { addRecipe, fetchRecipes, toggleFavourite } = useRecipeStorage();
  const { showModal, hideModal } = useModal();
  const { getNutritionFromBarcode } = useGetNutritionInfo();

  useEffect(() => {
    if (params.barcode) {
      const barcode = params.barcode as string;
      if (foods.some(food => food.id === barcode)) {
        console.warn("Food with this barcode already exists in the list.");
        return;
      }
      console.log("Barcode received:", barcode);
      const nutritionInfo = getNutritionFromBarcode(barcode);
      nutritionInfo.then(info => {
        if (!info) {
          console.error("No nutrition info found for barcode:", barcode);
          return;
        }
        showModal(<FoodModal food={info} onAddFood={handleAddFood} />);

      }).catch(err => {
        console.error("Error fetching nutrition info:", err);
      });
    }
  }, [params.barcode]);

  const handleAddFood = (newFood: Food) => {
    setFoods((curr) => [...curr, newFood]);
    hideModal();
  };

  const handleSave = () => {
    const meal: Meal = {
      id: uuid.v4(),
      title: title.length > 0 ? title : (mode === 'magic' ? mealDescription.substring(0, 32) : 'Untitled Meal'),
      protein: mode === 'manual' ? Number(protein) || 0 : 0,
      carbs: mode === 'manual' ? Number(carbs) || 0 : 0,
      fats: mode === 'manual' ? Number(fats) || 0 : 0,
      calories: mode === 'manual' ? Number(calories) || 0 : 0,
      timestamp: Date.now(),
    };
    addMeal(meal);
    // Save recipe if manual mode and all fields are filled, and no equivalent recipe exists
    if (mode === 'manual' && title.trim() && protein && carbs && fats && calories) {
      const newRecipe: Recipe = {
        id: uuid.v4(),
        title: title.trim(),
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fats: Number(fats) || 0,
        calories: Number(calories) || 0,
        isFavourite: false,
      };
      const existingRecipes = fetchRecipes();
      const isDuplicate = existingRecipes.some((r) =>
        r.title === newRecipe.title &&
        r.protein === newRecipe.protein &&
        r.carbs === newRecipe.carbs &&
        r.fats === newRecipe.fats &&
        r.calories === newRecipe.calories
      );
      if (!isDuplicate) {
        addRecipe(newRecipe);
      }
    }
    router.back();
  };

  const handleScanBarcode = () => {
    router.replace('/meals/BarcodeScannerPage');
  }

  const handlePickRecipe = () => {
    // Use local state for recipes so we can update immediately on favourite toggle
    function RecipeModal() {
      const [recipes, setRecipes] = useState<Recipe[]>(() => fetchRecipes());
      // Sort favourites to top
      const sortedRecipes = [...recipes].sort((a, b) => (b.isFavourite ? 1 : 0) - (a.isFavourite ? 1 : 0));
      const handleToggleFavourite = (recipe: Recipe) => {
        toggleFavourite(recipe.id);
        // Update local state after toggling
        setRecipes(fetchRecipes());
      };
      return (
        <View className="bg-card rounded-xl p-4 w-11/12 max-w-xl">
          <Text className="text-xl font-bold text-txt-primary mb-4">Pick a Recipe</Text>
          <RecipeList
            recipes={sortedRecipes}
            onSelect={(recipe) => {
              setTitle(recipe.title);
              setProtein(recipe.protein.toString());
              setCarbs(recipe.carbs.toString());
              setFats(recipe.fats.toString());
              setCalories(recipe.calories.toString());
              hideModal();
            }}
            onToggleFavourite={handleToggleFavourite}
          />
          <GradientPressable className="mt-4" style="default" onPress={hideModal}>
            <Text className="text-txt-primary text-center font-semibold my-2">Close</Text>
          </GradientPressable>
        </View>
      );
    }
    showModal(<RecipeModal />);
  };

  return (
    <ScrollView className="bg-primary px-4" showsVerticalScrollIndicator={false}>
      <View className="flex-row justify-between items-center mt-4">
        <Text className="text-2xl font-bold text-txt-primary">Track Meal</Text>
        <ToggleList
          options={['Manual', 'Magic']}
          initialOption={mode === 'manual' ? 'Manual' : 'Magic'}
          onOptionSelected={(option: string) => setMode(option.toLowerCase() as 'manual' | 'magic')}
          className="ml-2"
          connected
        />
      </View>
      <GradientPressable className="mt-8" style="gray" onPress={handleScanBarcode}>
        <View className="flex-row items-center justify-center gap-2 px-2 py-2">
          <Text className="text-txt-secondary text-center">Scan Barcode</Text>
          <MaterialCommunityIcons name="barcode-scan" size={16} color="#aaaaaa" />
        </View>
      </GradientPressable>
      <GradientPressable className="mt-2" style="gray" onPress={handlePickRecipe}>
        <Text className="text-txt-secondary mx-2 my-2 text-center">Choose from saved recipes</Text>
      </GradientPressable>
      <Text className="text-txt-secondary text-center mt-4">or</Text>
      {mode === 'manual' ? (
        <View>
          {foods.map((food, index) => (
            <GradientPressable
              key={index}
              className="mt-4">
              <View className="p-4">
                <Text className="text-txt-primary font-semibold">{food.name}</Text>
                <Text className="text-txt-secondary">{food.protein100g}g P / {food.carbs100g}g C / {food.fats100g}g F / {food.calories100g} kcal</Text>
              </View>
            </GradientPressable>
          ))}
          <GradientPressable
            className="mt-4"
            onPress={() => showModal(<FoodModal></FoodModal>)}
          >
            <View className="p-2">
              <Text className="text-txt-secondary text-center font-semibold">Add Food</Text>
            </View>
          </GradientPressable>
        </View>

      )
        : (
          <View className="mt-4">
            <Text className="text-txt-secondary mb-2">Describe your meal</Text>
            <TextInput
              className="bg-card rounded-lg p-3 text-txt-primary h-32"
              multiline
              value={mealDescription}
              onChangeText={setMealDescription}
              placeholder="E.g. 300g grilled chicken breast, 150g rice, 100g broccoli"
              placeholderTextColor="#888"
            />
          </View>
        )}
      <GradientPressable
        style="default"
        disabled={!title.trim()}
        className="mt-8 mb-8"
        onPress={handleSave}
      >
        <Text className="text-lg font-bold text-txt-primary text-center my-2 mx-4">Save Meal</Text>
      </GradientPressable>
    </ScrollView>
  );
}
