import GradientPressable from "@/components/shared/GradientPressable";
import useStorage from "@/hooks/useStorage";
import { SessionDefinition } from "@/interfaces/SessionDefinition";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function WorkoutProgressionList() {
  const [sessions, setSessions] = useState<SessionDefinition[]>([]);
  const { fetchFromStorage } = useStorage();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const allSessions = fetchFromStorage<SessionDefinition[]>('data_sessions') ?? [];
      setSessions(allSessions.reverse());
    }
  }, [isFocused]);

  return (
    <View className="bg-primary h-full px-4">
      <FlatList
        ListHeaderComponent={<Text className="text-txt-primary text-4xl font-bold mt-4 mb-8">Your workout sessions</Text>}
        showsVerticalScrollIndicator={false}
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const sessionDate = item ? new Date(item.timestamp) : null;
          const formattedSessionTime = sessionDate ? `${sessionDate.toLocaleDateString()}, ${sessionDate.toLocaleTimeString()}` : '';
          return (
            <GradientPressable
              style="gray"
              onPress={() => router.push({ pathname: '/progression/WorkoutProgressionPage', params: { sessionId: item.id } })}
            >
              <View className="px-4 py-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-txt-primary text-lg font-semibold">{item.workoutName}</Text>
                  <Text className="text-txt-secondary text-sm">{formattedSessionTime}</Text>
                </View>
                {item.exercises.map((exercise, index) => (
                  <Text key={index} className="text-txt-secondary text-base">{exercise.exerciseName}</Text>
                ))}
              </View>
            </GradientPressable>
          )
        }
        }
        ItemSeparatorComponent={() => <View className="h-4" />}
      />
    </View>
  );
}