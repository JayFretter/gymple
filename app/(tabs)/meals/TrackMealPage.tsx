import { useModal } from "@/components/ModalProvider";
import FoodModal from "@/components/shared/FoodModal";
import GradientPressable from "@/components/shared/GradientPressable";
import { SavedMealList } from "@/components/shared/RecipeList";
import SwipeDeleteView from "@/components/shared/SwipeDeleteView";
import ToggleList from "@/components/shared/ToggleList";
import useGetNutritionInfo from "@/hooks/useGetNutritionInfo";
import useMealBuilderStore from "@/hooks/useMealBuilderStore";
import useMealStorage from "@/hooks/useMealStorage";
import useSavedMealStorage from "@/hooks/useRecipeStorage";
import { Food } from "@/interfaces/Food";
import { Meal } from "@/interfaces/Meal";
import { SavedMeal } from "@/interfaces/SavedMeal";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import uuid from 'react-native-uuid';
import { useShallow } from 'zustand/react/shallow';

export default function TrackMealPage() {
  const params = useLocalSearchParams();
  const [mode, setMode] = useState<'manual' | 'magic'>('manual');

  const { foods, setFoods, upsertFood, removeFood, clearAllFoods } = useMealBuilderStore(
    useShallow((state) => ({ foods: state.foods, setFoods: state.setFoods, upsertFood: state.upsertFood, removeFood: state.removeFood, clearAllFoods: state.clearAll })),
  )

  const [title, setTitle] = useState<string>('');
  const [mealDescription, setMealDescription] = useState<string>('');
  const router = useRouter();
  const { addMeal, fetchMeals } = useMealStorage();
  const { addSavedMeal, fetchSavedMeals, toggleFavourite } = useSavedMealStorage();
  const { showModal, hideModal } = useModal();
  const { getNutritionFromBarcode } = useGetNutritionInfo();

  useEffect(() => {
    if (params.mealId) {
      const mealId = params.mealId as string;
      const existingMeal = fetchMeals().find(meal => meal.id === mealId);
      if (existingMeal) {
        setTitle(existingMeal.title);
        setFoods(existingMeal.foods);
      } else {
        console.warn("Meal not found:", mealId);
      }
    }
  }, [params.mealId]);

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
          console.warn("No nutrition info found for barcode:", barcode);
          // TODO: show error message to user
          return;
        }
        showModal(<FoodModal food={info} onAddFood={handleAddFood} submitText="Add Food" />);

      }).catch(err => {
        console.error("Error fetching nutrition info:", err);
      });
    }
  }, [params.barcode]);

  const handleAddFood = (newFood: Food) => {
    upsertFood(newFood);
    hideModal();
  };

  const handleSave = () => {
    const meal: Meal = {
      id: uuid.v4(),
      title: title.length > 0 ? title : (mode === 'magic' ? mealDescription.substring(0, 32) : 'Untitled Meal'),
      foods: foods,
      timestamp: Date.now(),
    };
    addMeal(meal);
    addSavedMeal({
      id: uuid.v4(),
      title: meal.title,
      foods: meal.foods,
      isFavourite: false
    })

    clearAllFoods();
    router.back();
  };

  const handlePickSavedMeal = () => {
    // Use local state for saved meals so we can update immediately on favourite toggle
    function SavedMealModal() {
      const [savedMeals, setSavedMeals] = useState<SavedMeal[]>(() => fetchSavedMeals());
      // Sort favourites to top
      const sortedSavedMeals = [...savedMeals].sort((a, b) => (b.isFavourite ? 1 : 0) - (a.isFavourite ? 1 : 0));
      const handleToggleFavourite = (savedMeal: SavedMeal) => {
        toggleFavourite(savedMeal.id);
        // Update local state after toggling
        setSavedMeals(fetchSavedMeals());
      };
      return (
        <View className="bg-card rounded-xl p-4 w-11/12 max-w-xl">
          <Text className="text-xl font-bold text-txt-primary mb-4">Pick a Saved Meal</Text>
          <SavedMealList
            savedMeals={sortedSavedMeals}
            onSelect={(savedMeal) => {
              setTitle(savedMeal.title);
              setFoods(savedMeal.foods);
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
    showModal(<SavedMealModal />);
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
      <GradientPressable className="mt-8" style="gray" onPress={handlePickSavedMeal}>
        <Text className="text-txt-secondary mx-2 my-2 text-center">Choose from saved meals</Text>
      </GradientPressable>
      <Text className="text-txt-secondary text-center mt-4">or</Text>
      <Text className="text-txt-secondary text-xl mb-2">Meal name</Text>
      <TextInput
        className="bg-card rounded-lg p-3 text-txt-primary"
        keyboardType="default"
        value={title}
        onChangeText={setTitle}
        placeholder="E.g. Chicken and Rice"
        placeholderTextColor="#888"
      />
      <Text className="text-txt-secondary text-xl mt-4">Foods</Text>
      {foods.map((food, index) => (
        <SwipeDeleteView key={food.id} onDismiss={() => removeFood(food.id)}>
          <GradientPressable
            className="mt-2"
            onPress={() => showModal(<FoodModal food={food} onAddFood={handleAddFood} submitText="Update Food" />)}
          >
            <View className="p-4">
              <Text className="text-txt-primary font-semibold text-lg">{food.name} <Text className="text-base text-txt-secondary font-normal">({food.gramsUsed}g)</Text></Text>
              <Text className="text-txt-secondary text-sm">{food.protein100g}g P / {food.carbs100g}g C / {food.fats100g}g F / {food.calories100g} kcal</Text>
            </View>
          </GradientPressable>
        </SwipeDeleteView>
      ))}
      <GradientPressable
        className="mt-4"
        onPress={() => showModal(<FoodModal onAddFood={handleAddFood} submitText="Add Food" />)}
      >
        <View className="p-2">
          <Text className="text-txt-secondary text-center font-semibold">Add Food</Text>
        </View>
      </GradientPressable>
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
