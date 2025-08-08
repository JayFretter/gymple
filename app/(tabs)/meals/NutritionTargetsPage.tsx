import BgView from "@/components/shared/BgView";
import GradientPressable from "@/components/shared/GradientPressable";
import useUserPreferences from "@/hooks/useUserPreferences";
import UserPreferences from "@/interfaces/UserPreferences";
import { storage } from "@/storage";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export default function NutritionTargetsPage() {
  const [getUserPreferences] = useUserPreferences();
  const initialTargets = (() => {
    const prefs: UserPreferences = getUserPreferences();
    return prefs.nutritionTargets || {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fats: 60
    };
  })();
  const [targets, setTargets] = useState<NutritionTargets>(initialTargets);
  const [saving, setSaving] = useState<boolean>(false);

  const caloriesRef = useRef<TextInput>(null);
  const proteinRef = useRef<TextInput>(null);
  const carbsRef = useRef<TextInput>(null);
  const fatsRef = useRef<TextInput>(null);

  const handleChange = (field: keyof NutritionTargets, value: string) => {
    setTargets(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Save nutrition targets to user preferences in storage
    const prefs: UserPreferences = getUserPreferences();
    const updatedPrefs: UserPreferences = { ...prefs, nutritionTargets: targets };
    storage.set('data_user_preferences', JSON.stringify(updatedPrefs));
    setSaving(false);
    router.back();
  };

  return (
    <BgView className="px-4">
      <ScrollView>
        <View className="flex-row justify-between items-center mt-4 mb-4">
          <Text className="text-3xl font-bold text-txt-primary">Daily Nutrition Targets</Text>
        </View>
        <Animated.View
          entering={FadeInUp.delay(100).duration(400)}
          className="mt-4 flex gap-4"
        >
          <Animated.View entering={FadeInUp.delay(100).duration(400)}>
            <Text className="text-txt-secondary mb-2 text-base">Calories</Text>
            <TextInput
              className="bg-card rounded-lg p-3 text-txt-primary text-lg"
              keyboardType="numeric"
              value={targets.calories.toString()}
              onChangeText={v => handleChange("calories", v)}
              placeholder="2000"
              placeholderTextColor="#888"
              returnKeyType="next"
              ref={caloriesRef}
              onSubmitEditing={() => proteinRef.current?.focus()}
              submitBehavior='submit'
            />
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(200).duration(400)}>
            <Text className="text-txt-secondary mb-2 text-base">Protein (g)</Text>
            <TextInput
              className="bg-card rounded-lg p-3 text-txt-primary text-lg"
              keyboardType="numeric"
              value={targets.protein.toString()}
              onChangeText={v => handleChange("protein", v)}
              placeholder="150"
              placeholderTextColor="#888"
              returnKeyType="next"
              ref={proteinRef}
              onSubmitEditing={() => carbsRef.current?.focus()}
              submitBehavior='submit'
            />
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(300).duration(400)}>
            <Text className="text-txt-secondary mb-2 text-base">Carbs (g)</Text>
            <TextInput
              className="bg-card rounded-lg p-3 text-txt-primary text-lg"
              keyboardType="numeric"
              value={targets.carbs.toString()}
              onChangeText={v => handleChange("carbs", v)}
              placeholder="200"
              placeholderTextColor="#888"
              returnKeyType="next"
              ref={carbsRef}
              onSubmitEditing={() => fatsRef.current?.focus()}
              submitBehavior='submit'
            />
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(400).duration(400)}>
            <Text className="text-txt-secondary mb-2 text-base">Fats (g)</Text>
            <TextInput
              className="bg-card rounded-lg p-3 text-txt-primary text-lg"
              keyboardType="numeric"
              value={targets.fats.toString()}
              onChangeText={v => handleChange("fats", v)}
              placeholder="60"
              placeholderTextColor="#888"
              returnKeyType="done"
              ref={fatsRef}
            />
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(500).duration(400)}>
            <GradientPressable
              style="default"
              disabled={saving}
              className="mt-4 mb-8"
              onPress={handleSave}
            >
              <Text className="text-lg font-bold text-txt-primary text-center my-2 mx-4">Save</Text>
            </GradientPressable>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </BgView>
  );
}
