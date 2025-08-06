import { Food } from "@/interfaces/Food";
import { useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";
import GradientPressable from "./GradientPressable";

export interface FoodFormProps {
  food?: Food;
  submitText?: string;
  onSubmit?: (food: Food) => void;
}

export default function FoodForm({ food, submitText, onSubmit }: FoodFormProps) {
  const [title, setTitle] = useState<string>(food?.name || '');
  const [protein, setProtein] = useState<string>(food?.protein100g.toString() || '');
  const [carbs, setCarbs] = useState<string>(food?.carbs100g.toString() || '');
  const [fats, setFats] = useState<string>(food?.fats100g.toString() || '');
  const [calories, setCalories] = useState<string>(food?.calories100g.toString() || '');

  const proteinRef = useRef<TextInput>(null);
  const carbsRef = useRef<TextInput>(null);
  const fatsRef = useRef<TextInput>(null);
  const caloriesRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    if (!onSubmit) return;

    const newFood: Food = {
      id: food?.id || '',
      name: title,
      protein100g: parseInt(protein) || 0,
      carbs100g: parseInt(carbs) || 0,
      fats100g: parseInt(fats) || 0,
      calories100g: parseInt(calories) || 0,
      gramsUsed: 100, // Assuming default serving size is 100g
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
      />
      <View className="mt-4 flex gap-4">
        <View className="flex-row items-center gap-4">
          <View className="flex-1">
            <Text className="text-txt-secondary mb-2">Protein (g)</Text>
            <TextInput
              ref={proteinRef}
              className="bg-tertiary rounded-lg p-3 text-txt-primary"
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
          <View className="flex-1">
            <Text className="text-txt-secondary mb-2">Carbs (g)</Text>
            <TextInput
              ref={carbsRef}
              className="bg-tertiary rounded-lg p-3 text-txt-primary"
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
        </View>
        <View className="flex-row items-center gap-4">
          <View className="flex-1">
            <Text className="text-txt-secondary mb-2">Fats (g)</Text>
            <TextInput
              ref={fatsRef}
              className="bg-tertiary rounded-lg p-3 text-txt-primary"
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
          <View className="flex-1">
            <Text className="text-txt-secondary mb-2">Calories</Text>
            <TextInput
              ref={caloriesRef}
              className="bg-tertiary rounded-lg p-3 text-txt-primary"
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
              placeholder="0"
              placeholderTextColor="#888"
              returnKeyType="done"
            />
          </View>
        </View>

      </View>
      <GradientPressable className="mt-4" style="default" onPress={handleSubmit}>
        <Text className="text-txt-primary text-center font-semibold my-2">{submitText || 'Submit'}</Text>
      </GradientPressable>
    </View>
  );
}
