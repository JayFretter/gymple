import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import useStorage from "@/hooks/useStorage";
import Achievement from "@/interfaces/Achievement";
import AchievementBadge from "@/components/shared/AchievementBadge";
import useGetAchievementInfo from "@/hooks/useGetAchievementInfo";
import { AchievementType } from "@/enums/achievement-type";
import { formatDistance, formatRelative } from "date-fns";
import { roundHalf } from "@/utils/maths-utils";
import ExerciseDefinition from "@/interfaces/ExerciseDefinition";

export default function AchievementTypeHistoryPage() {
  const { type } = useLocalSearchParams();
  const { fetchFromStorage } = useStorage();
  const { getAchievementName, getAchievementDescription } = useGetAchievementInfo();
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [exerciseIdToNameMap, setExerciseIdToNameMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const storedAchievements = fetchFromStorage<Achievement[]>("data_achievements") ?? [];
    const filtered = storedAchievements
      .filter((a) => a.type === type)
      .sort((a, b) => b.timestamp - a.timestamp);
    setAchievements(filtered);

    const storedExercises = fetchFromStorage<ExerciseDefinition[]>("data_exercises") ?? [];
    const idToNameMap = new Map<string, string>();
    storedExercises.forEach((exercise) => {
      idToNameMap.set(exercise.id, exercise.name);
    });
    setExerciseIdToNameMap(idToNameMap);
  }, [type]);

  const capitaliseFirstChar = (val: string) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  }

  const getExerciseNameFromId = (exerciseId: string) => {
    return exerciseIdToNameMap.get(exerciseId) || "Unknown Exercise";
  }

  return (
    <ScrollView className="flex-1 bg-primary px-4" showsVerticalScrollIndicator={false}>
      <Text className="text-txt-primary text-3xl font-bold mb-4 mt-12">
        {getAchievementName(type as AchievementType)}
      </Text>
      <Text className="text-txt-secondary mb-6">
        {getAchievementDescription(type as AchievementType)}
      </Text>
      <View className="flex gap-4 pb-8">
        {achievements.length === 0 && (
          <Text className="text-txt-secondary">No achievements of this type yet.</Text>
        )}
        {achievements.map((achievement, idx) => (
          <Pressable
            key={idx}
            className="flex-row items-center justify-between bg-card rounded-xl p-4"
            onPress={() =>
              router.push({
                pathname: "/progression/WorkoutProgressionPage",
                params: { sessionId: achievement.sessionId },
              })
            }
          >
            <View>
              <Text className="text-txt-primary font-semibold text-lg">
                {getAchievementName(achievement.type)}
              </Text>
              <Text className="text-txt-secondary text-sm mb-2">
                {capitaliseFirstChar(formatDistance(new Date(achievement.timestamp), new Date(), { addSuffix: true }))}
              </Text>
              <View className="">
                <Text className="text-txt-secondary text-sm">{getExerciseNameFromId(achievement.exerciseId)}</Text>
                {achievement.type !== AchievementType.FirstTime &&
                  <Text className="text-txt-secondary">
                    {roundHalf(achievement.previousValue.weight ?? 0)} → {roundHalf(achievement.value.weight ?? 0)} kg
                  </Text>
                }
              </View>
            </View>
            <AchievementBadge small type={achievement.type} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
