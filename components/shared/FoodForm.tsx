import { Food } from "@/interfaces/Food";
import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";
import GradientPressable from "./GradientPressable";
import MacroBars from "./MacroBars";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import LockableTextInput from "./LockableTextInput";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
  const [perGramMap, setPerGramMap] = useState<Map<string, number>>(new Map());
  const [linked, setLinked] = useState<boolean>(!!food);

  const proteinRef = useRef<TextInput>(null);
  const carbsRef = useRef<TextInput>(null);
  const fatsRef = useRef<TextInput>(null);
  const caloriesRef = useRef<TextInput>(null);
  const gramsUsedRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!food) return;

    const map = new Map<string, number>();
    map.set('protein', food.protein / food.gramsUsed);
    map.set('carbs', food.carbs / food.gramsUsed);
    map.set('fats', food.fats / food.gramsUsed);
    map.set('calories', food.calories / food.gramsUsed);
    setPerGramMap(map);
  }, [food]);

  const handleGramsUsedChange = (value: string) => {
    // Round to nearest integer
    const roundedGrams = Math.round(parseFloat(value) || 0);
    setGramsUsed(roundedGrams.toString());

    if (linked) {
      setProtein(Math.round((roundedGrams * (perGramMap.get('protein') ?? 0))).toString());
      setCarbs(Math.round((roundedGrams * (perGramMap.get('carbs') ?? 0))).toString());
      setFats(Math.round((roundedGrams * (perGramMap.get('fats') ?? 0))).toString());
      setCalories(Math.round((roundedGrams * (perGramMap.get('calories') ?? 0))).toString());
    }
  }

  const handleProteinChange = (value: string) => {
    const rounded = Math.round(parseFloat(value) || 0);
    setProtein(rounded.toString());
    // updatePerGramMap('protein', rounded.toString());
  };

  const handleCarbsChange = (value: string) => {
    const rounded = Math.round(parseFloat(value) || 0);
    setCarbs(rounded.toString());
    // updatePerGramMap('carbs', rounded.toString());
  };

  const handleFatsChange = (value: string) => {
    const rounded = Math.round(parseFloat(value) || 0);
    setFats(rounded.toString());
    // updatePerGramMap('fats', rounded.toString());
  };

  const handleCaloriesChange = (value: string) => {
    const rounded = Math.round(parseFloat(value) || 0);
    setCalories(rounded.toString());
    // updatePerGramMap('calories', rounded.toString());
  };

  const handleToggleLinked = () => {
    if (!linked) {
      const parsedProtein = parseFloat(protein) || 0;
      const parsedCarbs = parseFloat(carbs) || 0;
      const parsedFats = parseFloat(fats) || 0;
      const parsedCalories = parseFloat(calories) || 0;
      const parsedGramsUsed = parseFloat(gramsUsed) || 1;

      setProtein(parsedProtein.toString());
      setCarbs(parsedCarbs.toString());
      setFats(parsedFats.toString());
      setCalories(parsedCalories.toString());

      const map = new Map<string, number>();
      map.set('protein', parsedProtein / parsedGramsUsed);
      map.set('carbs', parsedCarbs / parsedGramsUsed);
      map.set('fats', parsedFats / parsedGramsUsed);
      map.set('calories', parsedCalories / parsedGramsUsed);
      setPerGramMap(map);
    }

    setLinked((prev) => !prev);
  };

  const handleSubmit = () => {
    if (!onSubmit) return;

    const newFood: Food = {
      id: food?.id || 'test',
      name: title,
      protein: Math.round(parseFloat(protein) || 0),
      carbs: Math.round(parseFloat(carbs) || 0),
      fats: Math.round(parseFloat(fats) || 0),
      calories: Math.round(parseFloat(calories) || 0),
      gramsUsed: Math.round(parseFloat(gramsUsed) || 0),
    };

    onSubmit(newFood);
  };

  return (
    <View>
      <MacroBars
        className="mt-4 w-1/2 self-center"
        protein={Math.round(parseFloat(protein) || 0)}
        carbs={Math.round(parseFloat(carbs) || 0)}
        fats={Math.round(parseFloat(fats) || 0)}
        animated
        hideValues
        maxBarHeight={40}
      />
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
       <View className="mt-4">
          <Text className="text-txt-secondary">Protein: {protein}g</Text>
          <Text className="text-txt-secondary">Carbs: {carbs}g</Text>
          <Text className="text-txt-secondary">Fats: {fats}g</Text>
          <Text className="text-txt-secondary">Calories: {calories}g</Text>
       </View>
       :
      <View className="mt-4 flex gap-4">
        <View className="flex-row items-center gap-4">
          <View className="flex-1">
            <Text className="text-txt-secondary mb-2">Protein (g)</Text>
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
            <Text className="text-txt-secondary mb-2">Carbs (g)</Text>
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
            <Text className="text-txt-secondary mb-2">Fats (g)</Text>
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
            <Text className="text-txt-secondary mb-2">Calories</Text>
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
      </View>}
      {/* Link toggle */}
      <View className="flex-row items-center justify-center mt-4">
        <Pressable
          onPress={handleToggleLinked}
          className="flex-row items-center gap-2"
          accessibilityRole="button"
          accessibilityLabel={linked ? "Unlink macros from amount" : "Link macros to amount"}
        >
          {linked ? (
            <FontAwesome name="lock" size={12} color="#888" />
          ) : (
            <FontAwesome name="unlock" size={12} color="#888" />
          )}
          <View className="flex-row items-center gap-1">
            <Text className='text-sm text-txt-secondary'>Macros</Text>
            <MaterialIcons name="compare-arrows" size={14} color="#888" />
            <Text className='text-sm text-txt-secondary'>Amount</Text>
          </View>
        </Pressable>
      </View>
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
      <GradientPressable className="mt-8" style="default" onPress={handleSubmit}>
        <Text className="text-white text-center font-semibold my-2">{submitText || 'Submit'}</Text>
      </GradientPressable>
    </View>
  );
}
