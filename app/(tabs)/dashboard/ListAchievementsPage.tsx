import AchievementBadge from "@/components/shared/AchievementBadge";
import { AchievementType } from "@/enums/achievement-type";
import useGetAchievementInfo from "@/hooks/useGetAchievementInfo";
import useStorage from "@/hooks/useStorage";
import Achievement from "@/interfaces/Achievement";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function ListAchievementsPage() {
  const isFocused = useIsFocused();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badgeCounts, setBadgeCounts] = useState(new Map<AchievementType, number>());
  const { fetchFromStorage } = useStorage();
  const { getAchievementName, getAchievementDescription } = useGetAchievementInfo();
  const router = useRouter();

  useEffect(() => {
    if (isFocused) {
      fetchAchievements();
    }
  }, [isFocused]);

  const fetchAchievements = () => {
    const storedAchievements = fetchFromStorage<Achievement[]>("data_achievements") ?? [];
    const counts = new Map<AchievementType, number>();
    storedAchievements.forEach((achievement) => {
      counts.set(achievement.type, (counts.get(achievement.type) || 0) + 1);
    });
    setBadgeCounts(counts);
    setAchievements(storedAchievements);
  };

  const getAchievementTypes = () => {
    return Array.from(badgeCounts.keys());
  };

  return (
    <ScrollView className="flex-1 bg-primary px-4" showsVerticalScrollIndicator={false}>
      <Text className="text-txt-primary text-3xl font-bold mb-4 mt-12">Your achievements</Text>
      <View className="flex gap-4">
        {getAchievementTypes().map((achievement, index) => (
          <Pressable
            className="flex-row items-center justify-between bg-card rounded-xl p-4"
            key={index}
            onPress={() =>
              router.push({
                pathname: "/dashboard/AchievementTypeHistoryPage",
                params: { type: achievement },
              })
            }
          >
            <View className="flex-1">
              <Text className="text-txt-primary font-semibold text-lg">{getAchievementName(achievement)}</Text>
              <Text className="text-txt-secondary text-sm">{getAchievementDescription(achievement)}</Text>
            </View>
            <View>
              <Text className="bg-blue-500 text-white font-semibold text-sm absolute right-0 rounded-md px-2 z-10 opacity-90">
                {badgeCounts.get(achievement) || 0}
              </Text>
              <AchievementBadge small type={achievement} />
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}