import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
// import Swipeable from "./Swipeable";
import SwipeDeleteView from "./SwipeDeleteView";
import { WeightUnit } from "@/enums/weight-unit";
import { SetPerformanceData } from "@/interfaces/ExercisePerformanceData";
import { MaterialIcons } from "@expo/vector-icons";
import GradientPressable from "./GradientPressable";

export type SetsListProps = {
  className?: string;
  sets: { weight: number; reps: number }[];
  handleSetSelected: (index: number) => void;
  addSet: () => void;
  removeSet: (index: number) => void;
  clearData: () => void;
  switchWeightUnit: () => void;
  weightUnit: WeightUnit;
  previousSessionSets?: SetPerformanceData[];
}

export default function SetsList({ className, sets, handleSetSelected, addSet, removeSet, clearData, switchWeightUnit, weightUnit, previousSessionSets = [] }: SetsListProps) {
  return (
    <View className={className}>
      <View className="flex gap-2">
        {
          sets.map((set, index) => (
            <SwipeDeleteView
              swipeDisabled={sets.length <= 1}
              key={index}
              onDismiss={() => removeSet(index)}
            >
              <Pressable
                className="bg-card flex-row justify-between items-center px-4 py-4 rounded-xl active:bg-primary"
                onPress={() => handleSetSelected(index)}
              >
                <Text className="text-center text-txt-primary font-bold text-xl">Set {index + 1}</Text>

                <View>
                  <Text className="text-center text-txt-secondary text-xs">Prev.</Text>
                  {previousSessionSets[index] ?
                    <Text className="text-center text-txt-secondary text-sm">{previousSessionSets[index].weight} {previousSessionSets[index].weightUnit} x {previousSessionSets[index].reps}</Text> :
                    <Text className="text-center text-txt-secondary text-sm">-</Text>
                  }
                </View>
                <View className='flex-row justify-between items-center gap-4'>
                  <View className='flex-row gap-1 items-center justify-center'>
                    <Text className='text-txt-primary font-semibold text-xl'>{set.weight}</Text>
                    <Text className='text-txt-secondary'>{weightUnit}</Text>
                  </View>
                  <FontAwesome name="times" size={16} color="#9ca3af" />
                  <View className='flex-row gap-1 items-center justify-center'>
                    <Text className='text-txt-primary font-semibold text-xl'>{set.reps}</Text>
                    <Text className='text-txt-secondary'>reps</Text>
                  </View>
                </View>
              </Pressable>
            </SwipeDeleteView>
          ))
        }
      </View>

      {
        sets.length > 1 &&
        <View className="flex flex-row items-center justify-center gap-1 mt-2">
          <MaterialIcons name="chevron-left" size={14} color="#9ca3af" />
          <Text className="text-txt-secondary text-sm">Swipe to delete a set</Text>
        </View>
      }
      <View className='flex flex-row w-full justify-between mt-2'>
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
      </View>
    </View>
  )
}