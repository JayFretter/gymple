import { Pressable, View, Text } from "react-native";
import { useModal } from "../ModalProvider";
import RestTimer from "../RestTimer";
import AntDesign from "@expo/vector-icons/AntDesign";
import useThemeColours from "@/hooks/useThemeColours";

export interface RestTimerModalProps {
  startSeconds: number;
}

export default function RestTimerModal({ startSeconds }: RestTimerModalProps) {
  const { hideModal } = useModal();
  const themeColour = useThemeColours();

  return (
    <View className="bg-card flex justify-center rounded-xl px-4 py-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-txt-primary">Rest Timer</Text>
        <Pressable onPress={hideModal}>
          <AntDesign name="close" size={16} color={themeColour('txt-primary')} />
        </Pressable>
      </View>
      <RestTimer className="mt-4" startSeconds={startSeconds} />
    </View>
  )
}