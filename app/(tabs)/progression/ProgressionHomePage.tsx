import GradientPressable from "@/components/shared/GradientPressable";
import { router } from "expo-router";
import { View, Text } from "react-native";

export default function ProgressionHomePage() {
    return (
        <View className="bg-primary h-full p-4">
            <Text className="text-txt-primary text-4xl font-bold">Progression</Text>
            <Text className="text-txt-secondary text-lg mt-2">View your progress and performance</Text>
            <GradientPressable style="gray" className="mt-4">
                <View className='flex-row items-center px-4 py-8'>
                    <Text className="text-txt-primary text-lg font-semibold">Workouts</Text>
                </View>
            </GradientPressable>
            <GradientPressable style="gray" className="mt-4" onPress={() => router.push('/progression/ExerciseProgressionList')}>
                <View className='flex-row items-center px-4 py-8'>
                    <Text className="text-txt-primary text-lg font-semibold">Exercises</Text>
                </View>
            </GradientPressable>
        </View>
    );
}