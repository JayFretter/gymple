import BgView from "@/components/shared/BgView";
import GradientPressable from "@/components/shared/GradientPressable";
import LevelBar from "@/components/shared/LevelBar";
import useFetchAllExercises from "@/hooks/useFetchAllExercises";
import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, FlatList } from "react-native";

export default function ExerciseProgressionList() {
    const [exercises, setExercises] = useState<ExerciseDefinition[]>([]);

    useEffect(() => {
        const allExercises = useFetchAllExercises();
        setExercises(allExercises);
    }, []);

    return (
        <BgView className="px-4">
          <FlatList
            ListHeaderComponent={<Text className="text-txt-primary text-4xl font-bold mt-4 mb-8">Exercise List</Text>}
            showsVerticalScrollIndicator={false}
            data={exercises}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
            <GradientPressable
              style="gray"
              onPress={() => router.push(`/progression/ExerciseProgressionPage?exerciseId=${item.id}`)}
            >
              <View className="px-4 py-4">
                <Text className="text-txt-primary text-lg font-semibold">{item.name}</Text>
                {/* <LevelBar className="mt-1" currentLevel={item.experience.level} percentage={item.experience.percentage} /> */}
              </View>
            </GradientPressable>
            )}
            ItemSeparatorComponent={() => <View className="h-4" />}
          />
        </BgView>
    );
}