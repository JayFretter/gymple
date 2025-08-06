import { TouchableOpacity, View, Text, Pressable, ScrollView } from "react-native";
import { useModal } from "./ModalProvider";
import UnorderedList from "./shared/UnorderedList";
import AntDesign from "@expo/vector-icons/AntDesign";

const FREE_FEATURES = [
  "Manage up to 3 workouts",
  "Basic exercise analytics",
  "View limited workout history (3 months)",
  "Create up to 3 custom exercises",
];

const PLUS_FEATURES = [
  "Manage unlimited workouts",
  "Advanced exercise analytics",
  "View full workout history",
  "Create unlimited custom exercises",
  "Meal and macro tracking",
  "Support us to add even more great features",
  "More muscle mass"
];

export default function SellGymplePlusModal() {
  const modal = useModal();

  return (
    <View className="bg-card w-full p-4 rounded-xl flex items-center">
      <Pressable className="self-end" onPress={modal.hideModal}>
        <AntDesign name="close" size={20} color="white" />
      </Pressable>
      <View className="flex-row items-center gap-2">
        <Text className="text-white text-3xl font-semibold">Gymple</Text>
        <Text className="text-black bg-yellow-300 rounded-xl px-2 text-lg font-semibold">Plus</Text>
      </View>
      <Text className="text-txt-secondary mt-4">Get access to exclusive features with <Text className="font-semibold">Gymple Plus.</Text></Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-8">
        <View className="flex bg-tertiary rounded-xl px-4 py-2">
          <View className="flex-row items-center gap-2 self-center">
            <Text className="text-white text-2xl font-semibold">Gymple</Text>
            <Text className="text-txt-secondary bg-card rounded-xl px-2 text-sm font-semibold">Basic</Text>
          </View>
          <UnorderedList className="mt-2" texts={FREE_FEATURES} checks checkColor="#999999" />
        </View>
        <View className="flex bg-tertiary rounded-xl px-4 py-2 ml-4">
          <View className="flex-row items-center gap-2 self-center">
            <Text className="text-white text-2xl font-semibold">Gymple</Text>
            <Text className="text-black bg-yellow-300 rounded-xl px-2 text-sm font-semibold">Plus</Text>
          </View>
          <UnorderedList className="mt-2" texts={PLUS_FEATURES} checks checkColor="#fde047" />
        </View>
      </ScrollView>
      <Text className="text-white font-semibold text-center mt-4">Get Gymple Plus</Text>
      <TouchableOpacity
        className="rounded-xl bg-blue-500 py-2 px-4 mt-2"
        onPress={modal.hideModal}
      >
        <Text className="text-white font-semibold text-center">£2.99/mo</Text>
      </TouchableOpacity>
      {/* TODO: Make this text apple/android specific */}
      <Text className="text-txt-tertiary text-xs text-center mt-4">Membership billed monthly. Cancel any time before 24 hours prior to the next billing cycle.
        Your subscription is managed by Apple or Google Play. 
      </Text>
    </View>
  );
}