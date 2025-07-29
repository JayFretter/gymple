import WeightAndRepsCard from "@/components/shared/WeightAndRepsCard";
import useStorage from "@/hooks/useStorage";
import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import { SessionDefinition } from "@/interfaces/SessionDefinition";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function WorkoutProgressionPage() {
  const params = useLocalSearchParams();
  const { fetchFromStorage } = useStorage();
  const [session, setSession] = useState<SessionDefinition | null>(null);
  const [exerciseIdToPerformanceData, setExerciseIdToPerformanceData] = useState<Map<string, ExercisePerformanceData>>(new Map());

  const sessionDate = session ? new Date(session.timestamp) : null;
  const formattedSessionTime = sessionDate ? `${sessionDate.toLocaleDateString()}, ${sessionDate.toLocaleTimeString()}` : '';

  useEffect(() => {
    const sessionId = params.sessionId as string;
    const allSessions = fetchFromStorage<SessionDefinition[]>('data_sessions') ?? [];

    const currentSession = allSessions.find(session => session.id === sessionId);
    if (currentSession) {
      setSession(currentSession);
    }
  }, []);


  useEffect(() => {
    if (session) {
      const exerciseIdToPerformance = new Map<string, ExercisePerformanceData>();
      session.exercises.forEach(exercise => {
        const performanceData = fetchFromStorage<ExercisePerformanceData[]>(`data_exercise_${exercise.exerciseId}`) ?? [];
        const performanceDataRelatedToSession = performanceData.find(data => data.sessionId === session.id);
        if (!performanceDataRelatedToSession) {
          return;
        }
        exerciseIdToPerformance.set(exercise.exerciseId, performanceDataRelatedToSession);
      });

      setExerciseIdToPerformanceData(exerciseIdToPerformance);
    }
  }, [session]);

  return (
    <ScrollView className="bg-primary h-full px-4">
      <Text className="text-txt-primary text-4xl font-bold mt-8">{session?.workoutName}</Text>
      <Text className="text-txt-secondary text-lg mt-2">{formattedSessionTime}</Text>
      <Text className="text-txt-primary text-xl font-semibold mt-6">Exercises performed</Text>
      {session?.exercises.map((exercise, index) => (
        <View key={index} className="mt-4 bg-card p-4 rounded-lg">
          <Text className="text-txt-primary text-lg font-semibold mb-2">{exercise.exerciseName}</Text>
          {exerciseIdToPerformanceData.has(exercise.exerciseId) ? (
            exerciseIdToPerformanceData.get(exercise.exerciseId)?.sets.map((set, setIndex) => (
              <WeightAndRepsCard
                key={setIndex}
                setNumber={setIndex + 1}
                weight={set.weight}
                reps={set.reps}
                weightUnit={set.weightUnit}
              />
            ))
          ) : (
            <Text className="text-txt-secondary text-base">No performance data available</Text>
          )}
          <TouchableOpacity
            className="flex-row items-center mt-4 gap-1"
            onPress={() => {router.push(`/progression/ExerciseProgressionPage?exerciseId=${exercise.exerciseId}`)}}
          >
            <Text className="text-blue-500 text-base">View all data for this exercise</Text>
            <AntDesign name="arrowright" size={12} color="#068bec" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}