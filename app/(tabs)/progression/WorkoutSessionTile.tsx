import GradientPressable from "@/components/shared/GradientPressable";
import { SessionDefinition } from "@/interfaces/SessionDefinition";
import { router } from "expo-router";
import { Text, View } from "react-native";

interface WorkoutSessionTileProps {
  session: SessionDefinition;
}

export default function WorkoutSessionTile({ session }: WorkoutSessionTileProps) {
  const sessionDate = new Date(session.timestamp);
  const formattedSessionTime = sessionDate.toLocaleTimeString();

  return (
    <GradientPressable
      className="mt-4"
      style="gray"
      onPress={() =>
        router.push({
          pathname: '/progression/WorkoutProgressionPage',
          params: { sessionId: session.id },
        })
      }
    >
      <View className="px-4 py-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-txt-primary text-lg font-semibold">
            {session.workoutName}
          </Text>
          <Text className="text-txt-secondary text-sm">
            {formattedSessionTime}
          </Text>
        </View>
        {session.exercises.map((exercise, index) => (
          <Text key={index} className="text-txt-secondary text-base">
            {exercise.exerciseName}
          </Text>
        ))}
      </View>
    </GradientPressable>
  );
}