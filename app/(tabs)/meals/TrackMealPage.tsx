import { useModal } from "@/components/ModalProvider";
import FoodModal from "@/components/shared/FoodModal";
import GradientPressable from "@/components/shared/GradientPressable";
import MacroBars from "@/components/shared/MacroBars";
import SavedMealModal from "@/components/shared/SavedMealModal";
import SwipeDeleteView from "@/components/shared/SwipeDeleteView";
import useGetNutritionInfo from "@/hooks/useGetNutritionInfo";
import useMealBuilderStore from "@/hooks/useMealBuilderStore";
import useMealStorage from "@/hooks/useMealStorage";
import useSavedMealStorage from "@/hooks/useRecipeStorage";
import { Food } from "@/interfaces/Food";
import { Meal } from "@/interfaces/Meal";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import uuid from 'react-native-uuid';
import { useShallow } from 'zustand/react/shallow';

export default function TrackMealPage() {
  const params = useLocalSearchParams();

  const { foods, name, setName, setFoods, upsertFood, removeFood, clearAllFoods } = useMealBuilderStore(
    useShallow((state) => ({ foods: state.foods, name: state.name, setName: state.setName, setFoods: state.setFoods, upsertFood: state.upsertFood, removeFood: state.removeFood, clearAllFoods: state.clearAll })),
  )

  const [existingMealId, setExistingMealId] = useState<string | null>(null);
  const router = useRouter();
  const { addMeal, fetchMeals } = useMealStorage();
  const { addSavedMeal, fetchSavedMeals, toggleFavourite } = useSavedMealStorage();
  const { showModal, hideModal } = useModal();
  const { getNutritionFromBarcode } = useGetNutritionInfo();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          className='active:opacity-75 disabled:opacity-35' onPress={() => handleSave()}
          disabled={!name.trim() || foods.length === 0}>
          <Text className="text-blue-500 font-semibold text-lg">Save</Text>
        </Pressable>
      )
    });
  }, [navigation, name, foods]);

  useEffect(() => {
    if (params.mealId) {
      const mealId = params.mealId as string;
      const existingMeal = fetchMeals().find(meal => meal.id === mealId);
      if (existingMeal) {
        setName(existingMeal.title);
        setFoods(existingMeal.foods);
        setExistingMealId(existingMeal.id);
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
        handleOpenFoodModal("Add Food");

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
      id: existingMealId ?? uuid.v4(),
      title: name,
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
    showModal(<SavedMealModal onSelect={(savedMeal) => {
      setName(savedMeal.title);
      setFoods(savedMeal.foods);
    }} />);
  };

  const handleOpenFoodModal = (submitText: string) => {
    showModal(<FoodModal onAddFood={handleAddFood} submitText={submitText} />, true);
  };

  return (
    <ScrollView className="bg-primary px-4" showsVerticalScrollIndicator={false}>
      <Pressable className="ml-auto mt-4" onPress={handlePickSavedMeal}>
        <Text className="text-blue-500 text-center">Choose from recent meals</Text>
      </Pressable>
      <Text className="text-3xl font-bold text-txt-primary mt-2">Track Meal</Text>
      <Text className="text-txt-secondary text-2xl font-semibold mb-4 mt-8">Meal name</Text>
      <TextInput
        className="bg-card rounded-lg px-4 py-2 text-txt-primary font-semibold text-xl"
        keyboardType="default"
        value={name}
        onChangeText={setName}
        placeholder="E.g. Chicken and Rice"
        placeholderTextColor="#888"
      />
      <MacroBars
        className="mt-8"
        carbs={foods.reduce((total, food) => total + food.carbs, 0)}
        protein={foods.reduce((total, food) => total + food.protein, 0)}
        fats={foods.reduce((total, food) => total + food.fats, 0)}
        calories={foods.reduce((total, food) => total + food.calories, 0)}
      />
      <Text className="text-txt-secondary text-2xl font-semibold mt-4 mb-2">Foods</Text>
      {foods.map((food, index) => (
        <SwipeDeleteView key={index} onDismiss={() => removeFood(food.id)}>
          <GradientPressable
            className="mt-2"
            onPress={() => handleOpenFoodModal("Update Food")}
          >
            <View className="p-4">
              <Text className="text-txt-primary font-semibold">{food.name} <Text className="text-txt-secondary font-normal">({food.gramsUsed}g)</Text></Text>
              <Text className="text-txt-secondary text-sm">{food.protein}g P / {food.carbs}g C / {food.fats}g F / {food.calories} kcal</Text>
            </View>
          </GradientPressable>
        </SwipeDeleteView>
      ))}
      <GradientPressable
        className="mt-4"
        style="default"
        onPress={() => handleOpenFoodModal("Add Food")}
      >
        <View className="p-2 flex-row items-center justify-center gap-2">
          <AntDesign name="plus" size={14} color="white" />
          <Text className="text-white text-center font-semibold">Add Food</Text>
        </View>
      </GradientPressable>
    </ScrollView>
  );
}
