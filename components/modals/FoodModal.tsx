import useIsPlusUser from "@/hooks/useIsPlusUser";
import { Food } from "@/interfaces/Food";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { useModal } from "../ModalProvider";
import SellGymplePlusModal from "./SellGymplePlusModal";
import FoodForm from "../shared/FoodForm";
import GradientPressable from "../shared/GradientPressable";

export interface FoodModalProps {
  food?: Food;
  onAddFood?: (food: Food) => void;
  submitText?: string;
}

export default function FoodModal({ food, onAddFood, submitText }: FoodModalProps) {
  const { showModal, hideModal } = useModal();
  const isPlusUser = useIsPlusUser();

  const handleScanBarcode = () => {
    hideModal();
    if (!isPlusUser) {
      showModal(<SellGymplePlusModal />, true);
      return;
    }
    router.push('/meals/BarcodeScannerPage');
  }

  const handleAddFood = (newFood: Food) => {
    if (onAddFood) {
      onAddFood(newFood);
    }
    hideModal();
  };

  return (
    <View className="w-full bg-card rounded-xl p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-txt-primary">Add Food</Text>
        <GradientPressable className="" style="default" onPress={handleScanBarcode}>
          <View className="flex-row items-center justify-center gap-2 px-2 py-2">
            <Text className="text-white text-center">Scan Barcode</Text>
            <MaterialCommunityIcons name="barcode-scan" size={16} color="white" />
          </View>
        </GradientPressable>
      </View>
      <FoodForm food={food} submitText={submitText} onSubmit={handleAddFood} />
      <GradientPressable className="mt-4" style="tertiary" onPress={hideModal}>
        <Text className="text-txt-primary text-center font-semibold my-2">Close</Text>
      </GradientPressable>
    </View>
  )
}