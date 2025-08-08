import { Food } from "@/interfaces/Food";
import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";
import GradientPressable from "./GradientPressable";
import MacroBars from "./MacroBars";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import LockableTextInput from "./LockableTextInput";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, { FadeIn, FadeInDown, FadeOut } from "react-native-reanimated";

export interface FoodFormProps {
  food?: Food;
  submitText?: string;
  onSubmit?: (food: Food) => void;
}

export default function FoodForm({ food, submitText, onSubmit }: FoodFormProps) {
  const [title, setTitle] = useState<string>(food?.name || '');
  const [protein, setProtein] = useState<string>(food?.protein.toString() || '');
  const [carbs, setCarbs] = useState<string>(food?.carbs.toString() || '');
  const [fats, setFats] = useState<string>(food?.fats.toString() || '');
  const [calories, setCalories] = useState<string>(food?.calories.toString() || '');
  const [gramsUsed, setGramsUsed] = useState<string>(food?.gramsUsed.toString() || '100');
  const [linked, setLinked] = useState<boolean>(!!food);

  const proportionOf100Grams = parseFloat(gramsUsed) / 100;
  const totalMacros = {
    protein: Math.round((parseFloat(protein) || 0) * proportionOf100Grams),
    carbs: Math.round((parseFloat(carbs) || 0) * proportionOf100Grams),
    fats: Math.round((parseFloat(fats) || 0) * proportionOf100Grams),
    calories: Math.round((parseFloat(calories) || 0) * proportionOf100Grams),
  }

  const proteinRef = useRef<TextInput>(null);
  const carbsRef = useRef<TextInput>(null);
  const fatsRef = useRef<TextInput>(null);
  const caloriesRef = useRef<TextInput>(null);
  const gramsUsedRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!food) return;
    setProtein(Math.round((food.protein / food.gramsUsed) * 100).toString());
    setCarbs(Math.round((food.carbs / food.gramsUsed) * 100).toString());
    setFats(Math.round((food.fats / food.gramsUsed) * 100).toString());
    setCalories(Math.round((food.calories / food.gramsUsed) * 100).toString());
  }, [food]);

  const handleGramsUsedChange = (value: string) => {
    const roundedGrams = Math.round(parseFloat(value) || 0);
    setGramsUsed(roundedGrams.toString());
  }

  const handleProteinChange = (value: string) => {
    const rounded = Math.round(parseFloat(value) || 0);
    setProtein(rounded.toString());
  };

  const handleCarbsChange = (value: string) => {
    const rounded = Math.round(parseFloat(value) || 0);
    setCarbs(rounded.toString());
  };

  const handleFatsChange = (value: string) => {
    const rounded = Math.round(parseFloat(value) || 0);
    setFats(rounded.toString());
  };

  const handleCaloriesChange = (value: string) => {
    const rounded = Math.round(parseFloat(value) || 0);
    setCalories(rounded.toString());
  };

  const handleToggleLinked = () => {
    // if (!linked) {
    //   const parsedProtein = parseFloat(protein) || 0;
    //   const parsedCarbs = parseFloat(carbs) || 0;
    //   const parsedFats = parseFloat(fats) || 0;
    //   const parsedCalories = parseFloat(calories) || 0;
    //   const parsedGramsUsed = parseFloat(gramsUsed) || 1;

    //   setProtein(parsedProtein.toString());
    //   setCarbs(parsedCarbs.toString());
    //   setFats(parsedFats.toString());
    //   setCalories(parsedCalories.toString());

    //   const map = new Map<string, number>();
    //   map.set('protein', parsedProtein / parsedGramsUsed);
    //   map.set('carbs', parsedCarbs / parsedGramsUsed);
    //   map.set('fats', parsedFats / parsedGramsUsed);
    //   map.set('calories', parsedCalories / parsedGramsUsed);
    //   setPer100GramsMap(map);
    // }

    setLinked((prev) => !prev);
  };

  const handleSubmit = () => {
    if (!onSubmit) return;

    const newFood: Food = {
      id: food?.id || 'test',
      name: title,
      protein: totalMacros.protein,
      carbs: totalMacros.carbs,
      fats: totalMacros.fats,
      calories: totalMacros.calories,
      gramsUsed: Math.round(parseFloat(gramsUsed) || 0),
    };

    onSubmit(newFood);
  };

  return (
    <View>
      <Text className="text-txt-secondary mt-2">Food Name</Text>
      <TextInput
        className="bg-tertiary rounded-lg p-3 text-txt-primary mt-2"
        keyboardType="default"
        value={title}
        onChangeText={setTitle}
        placeholder="E.g. White Rice"
        placeholderTextColor="#888"
        onSubmitEditing={() => proteinRef.current?.focus()}
        submitBehavior='submit'
      />
      {linked ?
        <View className="mt-4 flex items-center">
          <Text className="text-txt-secondary text-lg font-semibold">Per 100g {title}:</Text>
          <View className="flex-row items-center gap-8 mt-2">
            <Text className="text-txt-secondary">Protein: {protein}g</Text>
            <Text className="text-txt-secondary">Carbs: {carbs}g</Text>
          </View>
          <View className="flex-row items-center gap-8">
            <Text className="text-txt-secondary">Fats: {fats}g</Text>
            <Text className="text-txt-secondary">Calories: {calories}</Text>
          </View>
          <Pressable
            onPress={handleToggleLinked}
            className="flex-row items-center justify-center gap-2 mt-4"
          >
            <Text className='text-sm text-blue-500'>Edit macros/calories</Text>
          </Pressable>
        </View>
        :
        <Animated.View
          className="mt-4 flex gap-4 bg-tertiary p-4 rounded-xl"
          entering={FadeInDown.duration(300)}
        >
          <View className="flex-row items-center gap-4">
            <View className="flex-1">
              <Text className="text-txt-secondary mb-2">Protein per 100g</Text>
              <LockableTextInput
                ref={proteinRef}
                keyboardType="numeric"
                value={protein}
                onChangeText={handleProteinChange}
                locked={linked}
                placeholder="0"
                placeholderTextColor="#888"
                returnKeyType="next"
                onSubmitEditing={() => carbsRef.current?.focus()}
                submitBehavior='submit'
              />
            </View>
            <View className="flex-1">
              <Text className="text-txt-secondary mb-2">Carbs per 100g</Text>
              <LockableTextInput
                ref={carbsRef}
                keyboardType="numeric"
                value={carbs}
                onChangeText={handleCarbsChange}
                placeholder="0"
                placeholderTextColor="#888"
                returnKeyType="next"
                onSubmitEditing={() => fatsRef.current?.focus()}
                submitBehavior='submit'
                locked={linked}
              />
            </View>
          </View>
          <View className="flex-row items-center gap-4">
            <View className="flex-1">
              <Text className="text-txt-secondary mb-2">Fats per 100g</Text>
              <LockableTextInput
                ref={fatsRef}
                keyboardType="numeric"
                value={fats}
                onChangeText={handleFatsChange}
                locked={linked}
                placeholder="0"
                placeholderTextColor="#888"
                returnKeyType="next"
                onSubmitEditing={() => caloriesRef.current?.focus()}
                submitBehavior='submit'
              />
            </View>
            <View className="flex-1">
              <Text className="text-txt-secondary mb-2">Calories per 100g</Text>
              <LockableTextInput
                ref={caloriesRef}
                keyboardType="numeric"
                value={calories}
                onChangeText={handleCaloriesChange}
                placeholder="0"
                placeholderTextColor="#888"
                returnKeyType="done"
                locked={linked}
              />
            </View>
          </View>
          <Pressable
            onPress={handleToggleLinked}
            className="flex-row items-center justify-center gap-2"
          >
            <Text className='text-sm text-blue-500'>Hide macros/calories</Text>
          </Pressable>
        </Animated.View>}
      <Text className="text-txt-secondary mt-2">Amount (g)</Text>
      <TextInput
        ref={gramsUsedRef}
        className="bg-tertiary rounded-lg p-3 mt-2 text-txt-primary"
        keyboardType="numeric"
        value={gramsUsed}
        onChangeText={handleGramsUsedChange}
        placeholder="0"
        placeholderTextColor="#888"
        returnKeyType="done"
      />
      <MacroBars
        className="mt-8 w-1/2 self-center"
        protein={totalMacros.protein}
        carbs={totalMacros.carbs}
        fats={totalMacros.fats}
        animated
        maxBarHeight={40}
        calories={totalMacros.calories}
      />
      <GradientPressable className="mt-8" style="default" onPress={handleSubmit}>
        <Text className="text-white text-center font-semibold my-2">{submitText || 'Submit'}</Text>
      </GradientPressable>
    </View>
  );
}
