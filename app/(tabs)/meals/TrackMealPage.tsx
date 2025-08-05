import { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import GradientPressable from "@/components/shared/GradientPressable";
import useMealStorage from "@/hooks/useMealStorage";
import { Meal } from "@/interfaces/Meal";
import uuid from 'react-native-uuid';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TrackMealPage() {
  const [mode, setMode] = useState<'manual' | 'magic'>('manual');
  const [title, setTitle] = useState<string>('');
  const [protein, setProtein] = useState<string>('');
  const [carbs, setCarbs] = useState<string>('');
  const [fats, setFats] = useState<string>('');
  const [calories, setCalories] = useState<string>('');
  const [mealDescription, setMealDescription] = useState<string>('');
  const router = useRouter();
  const { addMeal } = useMealStorage();

  const proteinRef = useRef<TextInput>(null);
  const carbsRef = useRef<TextInput>(null);
  const fatsRef = useRef<TextInput>(null);
  const caloriesRef = useRef<TextInput>(null);

  const handleToggleMode = () => {
    setMode(mode === 'manual' ? 'magic' : 'manual');
  };

  const handleSave = () => {
    const meal: Meal = {
      id: uuid.v4() as string,
      title: title.length > 0 ? title : (mode === 'magic' ? mealDescription.substring(0, 32) : 'Untitled Meal'),
      protein: mode === 'manual' ? Number(protein) || 0 : 0,
      carbs: mode === 'manual' ? Number(carbs) || 0 : 0,
      fats: mode === 'manual' ? Number(fats) || 0 : 0,
      calories: mode === 'manual' ? Number(calories) || 0 : 0,
      timestamp: Date.now(),
    };
    addMeal(meal);
    router.back();
  };

  return (
    <ScrollView className="bg-primary px-4">
      <View className="flex-row justify-between items-center mt-4">
        <Text className="text-2xl font-bold text-txt-primary">Track Meal</Text>
        <GradientPressable
          style='default'
          onPress={handleToggleMode}
        >
          {mode === 'manual' ?
            <View className="flex-row items-center gap-1 px-2 py-1">
              <Text className='text-white'>Use Magic Mode</Text>
              <Ionicons name="color-wand" size={14} color="white" />
            </View> :
            <View className="flex-row items-center gap-2 px-2 py-1">
              <Text className='text-white'>Use Manual Mode</Text>
              {/* <Ionicons name="color-wand" size={20} color="white" /> */}
            </View>
          }

        </GradientPressable>
      </View>
      <Text className="text-txt-secondary mt-8 mb-2">Meal Title</Text>
      <TextInput
        className="bg-card rounded-lg p-3 text-txt-primary"
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
              onSubmitEditing={() => { }}
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
