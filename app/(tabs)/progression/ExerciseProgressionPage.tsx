import PerformanceChart from "@/components/PerformanceChart";
import useFetchAllExercises from "@/hooks/useFetchAllExercises";
import useStorage from "@/hooks/useStorage";
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
      <Text className="text-txt-primary text-4xl font-bold mt-4">{exercise?.name}</Text>
      <Text className="text-txt-secondary text-lg mb-8">Progression over time</Text>
      <PerformanceChart className="mt-4" performanceData={performanceData} />
    </ScrollView>
  );
}