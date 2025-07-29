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
      <Text className="text-txt-primary text-4xl font-bold mt-8">{exercise?.name}</Text>
      <Text className="text-txt-secondary text-lg mb-8">Progression over time</Text>

      <View className="flex items-center gap-2 mb-4">
        { oneRepMax !== null && <Text className="bg-card px-2 py-1 rounded-xl text-txt-secondary">1 Rep Max: {oneRepMax}</Text> }
        { estimatedOneRepMax !== null && <Text className="bg-card px-2 py-1 rounded-xl text-txt-secondary">Estimated 1 Rep Max: {estimatedOneRepMax}</Text> }
        { maxVolume !== null && <Text className="bg-card px-2 py-1 rounded-xl text-txt-secondary">Max volume performed: {maxVolume}</Text> }
      </View>
      <PerformanceChart className="mt-4" performanceData={performanceData} />
    </ScrollView>
  );
}