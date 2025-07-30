import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
// import Swipeable from "./Swipeable";
import SwipeDeleteView from "./SwipeDeleteView";
import { WeightUnit } from "@/enums/weight-unit";
import { SetPerformanceData } from "@/interfaces/ExercisePerformanceData";

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
    <View className={className + ''}>
      <View className="flex gap-2">
        {
          sets.map((set, index) => (
            <SwipeDeleteView
              swipeDisabled={sets.length <= 1}
              key={index}
              onDismiss={() => removeSet(index)}
            >
              <Pressable
                className="bg-card flex-row justify-between items-center border-[1px] border-gray-700 px-4 py-4 rounded-xl active:bg-primary"
                onPress={() => handleSetSelected(index)}
              >
                <Text className="text-center text-txt-primary font-bold text-xl">Set {index + 1}</Text>
                { previousSessionSets[index] && <Text className="text-center text-txt-secondary text-sm">Prev: {previousSessionSets[index].weight} {previousSessionSets[index].weightUnit} x {previousSessionSets[index].reps}</Text> }
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

      <View className='flex flex-row justify-between mt-2 mx-8 gap-12'>
        <TouchableOpacity
          className="flex-1"
          onPress={clearData}
        >
          <Text className="text-red-400 text-left font-semibold">Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-2 flex-row items-center justify-center"
          onPress={() => switchWeightUnit()}
        >
          <AntDesign name="swap" size={14} color="white" />
          <Text className="text-txt-secondary text-center">kg/lbs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1"
          onPress={addSet}
        >
          <Text className="text-blue-500 text-right font-semibold">+ Add Set</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}