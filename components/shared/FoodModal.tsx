import { View, Text } from "react-native";
import GradientPressable from "./GradientPressable";
import { useModal } from "../ModalProvider";
import FoodForm from "./FoodForm";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { Food } from "@/interfaces/Food";

export interface FoodModalProps {
  food?: Food;
  onAddFood?: (food: Food) => void;
}

export default function FoodModal({ food, onAddFood }: FoodModalProps) {
  const { hideModal } = useModal();

  const handleScanBarcode = () => {
    hideModal();
    router.replace('/meals/BarcodeScannerPage');
  }

  const handleAddFood = (newFood: Food) => {
    if (onAddFood) {
      onAddFood(newFood);
    }
    hideModal();
  };

  return (
    <View className="w-[95%] bg-card rounded-xl p-4">
      <Text className="text-xl font-bold text-txt-primary">Add Food</Text>
      <GradientPressable className="mt-8" style="subtleHighlight" onPress={handleScanBarcode}>
        <View className="flex-row items-center justify-center gap-2 px-2 py-2">
          <Text className="text-txt-secondary text-center">Scan Barcode</Text>
          <MaterialCommunityIcons name="barcode-scan" size={16} color="#aaaaaa" />
        </View>
      </GradientPressable>
      <FoodForm food={food} submitText="Add Food" onSubmit={handleAddFood} />
      <GradientPressable className="mt-4" style="default" onPress={hideModal}>
        <Text className="text-txt-primary text-center font-semibold my-2">Close</Text>
      </GradientPressable>
    </View>
  )
}