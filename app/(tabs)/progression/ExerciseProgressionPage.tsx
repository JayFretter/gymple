import PerformanceChart from "@/components/PerformanceChart";
import { WeightUnit } from "@/enums/weight-unit";
import { useConvertWeightUnit } from "@/hooks/useConvertWeightUnit";
import useFetchAllExercises from "@/hooks/useFetchAllExercises";
import useStorage from "@/hooks/useStorage";
import { useWeightString } from "@/hooks/useWeightString";
import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";

export default function ExerciseProgressionPage() {
  const params = useLocalSearchParams();
  const { fetchFromStorage } = useStorage();
  const [performanceData, setPerformanceData] = useState<ExercisePerformanceData[]>([]);
  const [exercise, setExercise] = useState<ExerciseDefinition | null>(null);
  const { convertToPreferredUnitString } = useWeightString();

  const oneRepMax = exercise?.oneRepMaxInKg ? convertToPreferredUnitString(exercise.oneRepMaxInKg, WeightUnit.KG) : null;
  const estimatedOneRepMax = exercise?.estimatedOneRepMaxInKg ? convertToPreferredUnitString(exercise.estimatedOneRepMaxInKg, WeightUnit.KG) : null;
  const maxVolume = exercise?.maxVolumeInKg ? convertToPreferredUnitString(exercise.maxVolumeInKg, WeightUnit.KG) : null;

  useEffect(() => {
    const exerciseId = params.exerciseId as string;
    const allExercises = useFetchAllExercises();

    const currentExercise = allExercises.find(exercise => exercise.id === exerciseId);
    if (currentExercise) {
      setExercise(currentExercise);
    }

    const historicPerformanceData = fetchFromStorage<ExercisePerformanceData[]>(`data_exercise_${exerciseId}`) ?? [];

    setPerformanceData(historicPerformanceData);
  }, []);

  return (
    <ScrollView className="bg-primary h-full px-4">
      <Text className="text-txt-primary text-3xl font-bold mt-8">{exercise?.name}</Text>
      <Text className="text-txt-secondary text-lg mb-8">Progression over time</Text>
      <Text className="text-txt-secondary mb-8">{exercise?.howTo}</Text>

      <Text className="text-txt-primary text-xl font-semibold mt-2">Exercise Stats</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
        <View className="bg-card p-4 rounded-xl">
          <View className="flex-row items-center gap-1">
            <Text className="text-txt-primary font-semibold text-lg">1 Rep Max</Text>
            {/* <Ionicons name="timer-outline" size={16} color="white" /> */}
          </View>
          <Text className="text-txt-secondary">{oneRepMax || 'n/a'}</Text>
        </View>
        <View className="bg-card p-4 ml-4 rounded-xl">
          <View className="flex-row items-center gap-2">
            <Text className="text-txt-primary font-semibold text-lg">Estimated 1 Rep Max</Text>
            {/* <FontAwesome6 name="weight-hanging" size={12} color="white" /> */}
          </View>
          <Text className="text-txt-secondary">{estimatedOneRepMax || 'n/a'}</Text>
        </View>
        <View className="bg-card p-4 ml-4 rounded-xl">
          <View className="flex-row items-center gap-2">
            <Text className="text-txt-primary font-semibold text-lg">Max Volume</Text>
            {/* <FontAwesome6 name="weight-hanging" size={12} color="white" /> */}
          </View>
          <Text className="text-txt-secondary">{maxVolume || 'n/a'}</Text>
        </View>
      </ScrollView>
      <Text className="text-txt-primary text-xl font-semibold mt-8">Performance Over Time</Text>
      <PerformanceChart className="mt-4" performanceData={performanceData} />
    </ScrollView>
  );
}