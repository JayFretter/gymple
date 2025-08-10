import AntDesign from "@expo/vector-icons/AntDesign";
import { Pressable, Text, View } from "react-native";
// import Swipeable from "./Swipeable";
import { WeightUnit } from "@/enums/weight-unit";
import { SetPerformanceData } from "@/interfaces/ExercisePerformanceData";
import { MaterialIcons } from "@expo/vector-icons";
import SetsListSet from "./SetsListSet";
import SwipeDeleteView from "./SwipeDeleteView";

export type SetsListProps = {
  className?: string;
  sets: SetPerformanceData[];
  handleSetSelected: (index: number) => void;
  addSet: () => void;
  removeSet: (index: number) => void;
  clearData: () => void;
  switchWeightUnit: () => void;
  weightUnit: WeightUnit;
  previousSessionSets?: SetPerformanceData[];
  onWeightChange?: (index: number, weight: number) => void;
  onRepsChange?: (index: number, reps: number) => void;
}

export default function SetsList({ className, sets, onWeightChange, onRepsChange, addSet, removeSet, clearData, switchWeightUnit, weightUnit, previousSessionSets = [] }: SetsListProps) {
  const renderSet = (set: SetPerformanceData, index: number) => {
    return (
      <SwipeDeleteView
        key={index}
        onDismiss={() => removeSet(index)}
      >
        <SetsListSet
          set={set}
          index={index}
          onWeightChange={onWeightChange}
          onRepsChange={onRepsChange}
          previousSessionSets={previousSessionSets}
          weightUnit={weightUnit}
        />
      </SwipeDeleteView>
    )
  }

  return (
    <View className={className}>
      <View className="flex gap-2">
        {
          sets.map((set, index) => (
            renderSet(set, index)
          ))
        }
        {/* {sets.length === 0 &&
          <Text className="text-txt-secondary text-center mb-2">No sets added yet.</Text>
        } */}
        <Pressable
          className="border border-highlight flex-row justify-center items-center gap-2 py-2 rounded-xl active:bg-card"
          onPress={addSet}
        >
          <AntDesign name="plus" size={14} color="#aaaaaa" />
          <Text className="text-center text-txt-secondary text-lg">Add set</Text>
        </Pressable>
        {
          sets.length > 0 &&
          <View className="flex flex-row items-center justify-center gap-1">
            <MaterialIcons name="chevron-left" size={14} color="#555555" />
            <Text className="text-txt-tertiary text-sm">Swipe to delete a set</Text>
          </View>
        }
      </View>
      {/* <View className='flex flex-row w-full justify-between mt-2'>
        <GradientPressable
          onPress={clearData}
        >
          <Text className="text-txt-secondary text-left mx-2 my-2">Reset</Text>
        </GradientPressable>
        <GradientPressable
          onPress={() => switchWeightUnit()}
        >
          <View className="flex-row items-center py-2 px-2">
            <AntDesign name="swap" size={14} color="#aaaaaa" />
            <Text className="text-txt-secondary text-center">kg/lbs</Text>
          </View>
        </GradientPressable>
        <GradientPressable
          style="default"
          onPress={addSet}
        >
          <Text className="text-white text-right mx-2 my-2">+ Add</Text>
        </GradientPressable>
      </View> */}
    </View>
  )
}