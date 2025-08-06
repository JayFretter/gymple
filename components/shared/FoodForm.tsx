import { Food } from "@/interfaces/Food";
import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";
import GradientPressable from "./GradientPressable";
import MacroBars from "./MacroBars";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import LockableTextInput from "./LockableTextInput";

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
  const [linked, setLinked] = useState<boolean>(true);

  const proteinRef = useRef<TextInput>(null);
  const carbsRef = useRef<TextInput>(null);
  const fatsRef = useRef<TextInput>(null);
  const caloriesRef = useRef<TextInput>(null);
  const gramsUsedRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!food) return;
    if (!linked) return;

    const map = new Map<string, number>();
    map.set('protein', food.protein / food.gramsUsed);
    map.set('carbs', food.carbs / food.gramsUsed);
    map.set('fats', food.fats / food.gramsUsed);
    map.set('calories', food.calories / food.gramsUsed);
    setPerGramMap(map);
  }, [food, linked]);

  const updatePerGramMap = (key: string, value: string) => {
    if (!linked) return;
    const newValue = parseFloat(value);
    if (isNaN(newValue) || newValue <= 0) return;
    setPerGramMap((prev) => new Map(prev).set(key, newValue / parseFloat(gramsUsed)));
  };

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
      const map = new Map<string, number>();
      map.set('protein', (parseFloat(protein) || 0) / (parseFloat(gramsUsed) || 1));
      map.set('carbs', (parseFloat(carbs) || 0) / (parseFloat(gramsUsed) || 1));
      map.set('fats', (parseFloat(fats) || 0) / (parseFloat(gramsUsed) || 1));
      map.set('calories', (parseFloat(calories) || 0) / (parseFloat(gramsUsed) || 1));
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
      <Text className="text-txt-secondary mt-4">Food Name</Text>
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
      <View className="mt-4 flex gap-4">
        <View className="flex-row items-center gap-4">
          <View className="flex-1">
            <Text className="text-txt-secondary mb-2">Protein (g)</Text>
            <LockableTextInput
              ref={proteinRef}
              // className={`bg-tertiary rounded-lg p-3 ${linked ? "text-txt-secondary" : "text-txt-primary"}`}
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
              className={`bg-tertiary rounded-lg p-3 ${linked ? "text-txt-secondary" : "text-txt-primary"}`}
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
              className={`bg-tertiary rounded-lg p-3 ${linked ? "text-txt-secondary" : "text-txt-primary"}`}
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
              className={`bg-tertiary rounded-lg p-3 ${linked ? "text-txt-secondary" : "text-txt-primary"}`}
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
      </View>
      <MacroBars
        className="mt-4 w-1/2 self-center"
        protein={Math.round(parseFloat(protein) || 0)}
        carbs={Math.round(parseFloat(carbs) || 0)}
        fats={Math.round(parseFloat(fats) || 0)}
        animated
        hideValues
        maxBarHeight={40}
      />
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
          <Text className='text-sm text-txt-secondary'>
            {linked ? "Macros linked to amount" : "Macros unlinked"}
          </Text>
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
      <GradientPressable className="mt-4" style="default" onPress={handleSubmit}>
        <Text className="text-txt-primary text-center font-semibold my-2">{submitText || 'Submit'}</Text>
      </GradientPressable>
    </View>
  );
}
