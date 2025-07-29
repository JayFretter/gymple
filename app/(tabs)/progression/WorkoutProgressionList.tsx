import GradientPressable from "@/components/shared/GradientPressable";
import LevelBar from "@/components/shared/LevelBar";
import useFetchAllExercises from "@/hooks/useFetchAllExercises";
import useStorage from "@/hooks/useStorage";
import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import { SessionDefinition } from "@/interfaces/SessionDefinition";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function WorkoutProgressionList() {
  const [sessions, setSessions] = useState<SessionDefinition[]>([]);
  const { fetchFromStorage } = useStorage();

  useEffect(() => {
    const allSessions = fetchFromStorage<SessionDefinition[]>('data_sessions') ?? [];
    setSessions(allSessions);
  }, []);

  return (
    <View className="bg-primary h-full px-4">
      <FlatList
        ListHeaderComponent={<Text className="text-txt-primary text-4xl font-bold mt-4 mb-8">Your workout sessions</Text>}
        showsVerticalScrollIndicator={false}
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GradientPressable
            style="gray"
            onPress={() => router.push({ pathname: '/progression/WorkoutProgressionPage', params: { sessionId: item.id } })}
          >
            <View className="px-4 py-4">
              <Text className="text-txt-primary text-lg font-semibold">{item.workoutName}</Text>
              <Text className="text-txt-primary text-sm">{new Date(item.timestamp).toLocaleDateString()}</Text>
              {item.exercises.map((exercise, index) => (
                <View key={index} className="mt-2">
                  <Text className="text-txt-secondary text-base">{exercise.exerciseName}</Text>
                </View>
              ))}
            </View>
          </GradientPressable>
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
      />
    </View>
  );
}