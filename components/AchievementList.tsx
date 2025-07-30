import useStorage from "@/hooks/useStorage";
import Achievement from "@/interfaces/Achievement";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import AchievementBadge from "./shared/AchievementBadge";
import { AchievementType } from "@/enums/achievement-type";

export interface AchievementListProps {
    className?: string;
}

export default function AchievementList({className}: AchievementListProps) {
    const isFocused = useIsFocused();
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [badgeCounts, setBadgeCounts] = useState(new Map<AchievementType, number>());
    const { fetchFromStorage } = useStorage();

    useEffect(() => {
        if (isFocused) {
            fetchAchievements();
        }
    }, [isFocused]);

    const fetchAchievements = () => {
        const storedAchievements = fetchFromStorage<Achievement[]>('data_achievements') ?? [];

        const counts = new Map<AchievementType, number>();
        storedAchievements.forEach(achievement => {
            counts.set(achievement.type, (counts.get(achievement.type) || 0) + 1);
        });
        setBadgeCounts(counts);

        setAchievements(storedAchievements);
    }

    const getAchievementTypes = () => {
        return Array.from(badgeCounts.keys());
    }

    if (achievements.length > 0) {
        return (
            <ScrollView className={className} horizontal showsHorizontalScrollIndicator={false}>
                <View className='flex-row gap-4 items-center w-full'>
                    {getAchievementTypes().map((achievement, index) => (
                        <View key={index}>
                            <Text className="bg-blue-500 text-white font-semibold text-sm absolute right-0 rounded-md px-2 z-10">
                                {badgeCounts.get(achievement) || 0}
                            </Text>
                            <AchievementBadge small type={achievement} />
                        </View>
                    ))}
                </View>
            </ScrollView>
        )
    } else {
        return (
            <View className={className}>
                <Text className="text-txt-secondary">No achievements yet. Start earning achievements by progressing on your lifts!</Text>
            </View>
        )
    }
}