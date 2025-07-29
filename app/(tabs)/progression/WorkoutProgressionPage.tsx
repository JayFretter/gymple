import WeightAndRepsCard from "@/components/shared/WeightAndRepsCard";
import { WeightUnit } from "@/enums/weight-unit";
import useCalculateVolume from "@/hooks/useCalculateVolume";
import useStorage from "@/hooks/useStorage";
import { useWeightString } from "@/hooks/useWeightString";
import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import { SessionDefinition } from "@/interfaces/SessionDefinition";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function WorkoutProgressionPage() {
  const params = useLocalSearchParams();
  const { fetchFromStorage } = useStorage();
  const [session, setSession] = useState<SessionDefinition | null>(null);
  const [exerciseIdToPerformanceData, setExerciseIdToPerformanceData] = useState<Map<string, ExercisePerformanceData>>(new Map());
  const calculateVolume = useCalculateVolume();
  const { convertToPreferredUnitString } = useWeightString();
  const [totalVolumeString, setTotalVolumeString] = useState<string>('');

  const sessionDate = session ? new Date(session.timestamp) : null;
  const formattedSessionTime = sessionDate ?
    sessionDate.toLocaleString('en-US',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }) : '';

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
      let totalVolumeInKg = 0;

      session.exercises.forEach(exercise => {
        const performanceData = fetchFromStorage<ExercisePerformanceData[]>(`data_exercise_${exercise.exerciseId}`) ?? [];
        const performanceDataRelatedToSession = performanceData.find(data => data.sessionId === session.id);
        if (!performanceDataRelatedToSession) {
          return;
        }
        exerciseIdToPerformance.set(exercise.exerciseId, performanceDataRelatedToSession);
        totalVolumeInKg += calculateVolume(performanceDataRelatedToSession.sets, WeightUnit.KG);
      });

      setExerciseIdToPerformanceData(exerciseIdToPerformance);
      setTotalVolumeString(convertToPreferredUnitString(totalVolumeInKg, WeightUnit.KG));
    }
  }, [session]);

  const getFormattedWorkoutDuration = () => {
    if (!session || session.duration <= 0) {
      return null;
    }

    const totalSeconds = session.duration / 1000;

    if (totalSeconds < 0)
      return '0s';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds % 60);

    let parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(' ');
  };

  return (
    <ScrollView className="bg-primary h-full px-4">
      <Text className="text-txt-primary text-4xl font-bold mt-8">{session?.workoutName}</Text>
      <Text className="text-txt-secondary text-lg mt-2">{formattedSessionTime}</Text>
      <Text className="text-txt-primary text-xl font-semibold mt-6">Session Stats</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
        <View className="bg-card p-4 rounded-xl">
          <View className="flex-row items-center gap-1">
            <Text className="text-txt-primary font-semibold text-lg">Workout Duration</Text>
            <Ionicons name="timer-outline" size={16} color="white" />
          </View>
          <Text className="text-txt-secondary">{getFormattedWorkoutDuration() || 'n/a'}</Text>
        </View>
        <View className="bg-card p-4 ml-2 rounded-xl">
          <View className="flex-row items-center gap-2">
            <Text className="text-txt-primary font-semibold text-lg">Total Volume</Text>
            <FontAwesome6 name="weight-hanging" size={12} color="white" />
          </View>
          <Text className="text-txt-secondary">{totalVolumeString}</Text>
        </View>
      </ScrollView>
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
            onPress={() => { router.push(`/progression/ExerciseProgressionPage?exerciseId=${exercise.exerciseId}`) }}
          >
            <Text className="text-blue-500 text-base">View all data for this exercise</Text>
            <AntDesign name="arrowright" size={12} color="#068bec" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}