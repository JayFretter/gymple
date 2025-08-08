import BgView from "@/components/shared/BgView";
import GradientPressable from "@/components/shared/GradientPressable";
import useThemeColours from "@/hooks/useThemeColours";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { View, Text } from "react-native";

export default function ProgressionHomePage() {
    const themeColour = useThemeColours();
    return (
        <BgView className="px-4 pt-12">
            <View className="flex-row items-center gap-2">
                <Text className="text-txt-primary text-4xl font-bold">Progression</Text>
                <Feather name="bar-chart-2" size={24} color={themeColour('txt-primary')} />
            </View>
            <Text className="text-txt-secondary text-lg mt-2">View your progress and performance</Text>
            <GradientPressable style="gray" className="mt-8" onPress={() => router.push('/progression/WorkoutProgressionList')}>
                <View className='px-4 py-8'>
                    <Text className="text-txt-primary text-lg font-semibold">Workouts</Text>
                    <Text className="text-txt-secondary text-sm">View your previous workout sessions</Text>
                </View>
            </GradientPressable>
            <GradientPressable style="gray" className="mt-4" onPress={() => router.push('/progression/ExerciseProgressionList')}>
                <View className='px-4 py-8'>
                    <Text className="text-txt-primary text-lg font-semibold">Exercises</Text>
                    <Text className="text-txt-secondary text-sm">View exercise-specific progression</Text>
                </View>
            </GradientPressable>
        </BgView>
    );
}