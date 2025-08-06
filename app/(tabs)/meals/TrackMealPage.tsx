import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import GradientPressable from "@/components/shared/GradientPressable";
import useMealStorage from "@/hooks/useMealStorage";
import useRecipeStorage from "@/hooks/useRecipeStorage";
import { Meal } from "@/interfaces/Meal";
import { Recipe } from "@/interfaces/Recipe";
import uuid from 'react-native-uuid';
import Ionicons from "@expo/vector-icons/Ionicons";
import ToggleList from "@/components/shared/ToggleList";
import { RecipeList } from "@/components/shared/RecipeList";
import { useModal } from "@/components/ModalProvider";
import useGetNutritionInfo from "@/hooks/useGetNutritionInfo";

export default function TrackMealPage() {
  const params = useLocalSearchParams();
  const [mode, setMode] = useState<'manual' | 'magic'>('manual');
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

  const proteinRef = useRef<TextInput>(null);
  const carbsRef = useRef<TextInput>(null);
  const fatsRef = useRef<TextInput>(null);
  const caloriesRef = useRef<TextInput>(null);

  useEffect(() => {
    if (params.barcode) {
      const barcode = params.barcode as string;
      console.log("Barcode received:", barcode);
      const nutritionInfo = getNutritionFromBarcode(barcode);
      nutritionInfo.then(info => {
        if (!info) {
          console.error("No nutrition info found for barcode:", barcode);
          return;
        }

        setTitle(info.name);
        setProtein(info.protein.toString());
        setCarbs(info.carbs.toString());
        setFats(info.fats.toString());
        setCalories(info.calories.toString());
      }).catch(err => {
        console.error("Error fetching nutrition info:", err);
      });
    }
  }, [params.barcode]);

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
    <ScrollView className="bg-primary px-4">
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
        <Text className="text-txt-secondary mx-2 my-2 text-center">Scan Barcode</Text>
      </GradientPressable>
      <GradientPressable className="mt-2" style="gray" onPress={handlePickRecipe}>
        <Text className="text-txt-secondary mx-2 my-2 text-center">Choose from saved recipes</Text>
      </GradientPressable>
      <Text className="text-txt-secondary text-center mt-4">or</Text>
      <Text className="text-txt-secondary mt-4">Food Name</Text>
      <TextInput
        className="bg-card rounded-lg p-3 text-txt-primary mt-2"
        keyboardType="default"
        value={title}
        onChangeText={setTitle}
        placeholder="E.g. Chicken Salad"
        placeholderTextColor="#888"
      />
      {mode === 'manual' ? (
        <View className="mt-4 flex gap-4">
          <View>
            <Text className="text-txt-secondary mb-2">Protein (g)</Text>
            <TextInput
              ref={proteinRef}
              className="bg-card rounded-lg p-3 text-txt-primary"
              keyboardType="numeric"
              value={protein}
              onChangeText={setProtein}
              placeholder="0"
              placeholderTextColor="#888"
              returnKeyType="next"
              onSubmitEditing={() => carbsRef.current?.focus()}
              submitBehavior='submit'
            />
          </View>
          <View>
            <Text className="text-txt-secondary mb-2">Carbs (g)</Text>
            <TextInput
              ref={carbsRef}
              className="bg-card rounded-lg p-3 text-txt-primary"
              keyboardType="numeric"
              value={carbs}
              onChangeText={setCarbs}
              placeholder="0"
              placeholderTextColor="#888"
              returnKeyType="next"
              onSubmitEditing={() => fatsRef.current?.focus()}
              submitBehavior='submit'
            />
          </View>
          <View>
            <Text className="text-txt-secondary mb-2">Fats (g)</Text>
            <TextInput
              ref={fatsRef}
              className="bg-card rounded-lg p-3 text-txt-primary"
              keyboardType="numeric"
              value={fats}
              onChangeText={setFats}
              placeholder="0"
              placeholderTextColor="#888"
              returnKeyType="next"
              onSubmitEditing={() => caloriesRef.current?.focus()}
              submitBehavior='submit'
            />
          </View>
          <View>
            <Text className="text-txt-secondary mb-2">Calories</Text>
            <TextInput
              ref={caloriesRef}
              className="bg-card rounded-lg p-3 text-txt-primary"
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
              placeholder="0"
              placeholderTextColor="#888"
              returnKeyType="done"
            />
          </View>
        </View>
      ) : (
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
