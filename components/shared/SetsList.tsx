import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

export type SetsListProps = {
    className?: string;
    sets: { weight: number; reps: number }[];
    handleSetSelected: (index: number) => void;
    addSet: () => void;
    clearData: () => void;
    switchWeightUnit: () => void;
    weightUnit: 'kg' | 'lbs';
}

export default function SetsList({className, sets, handleSetSelected, addSet, clearData, switchWeightUnit, weightUnit}: SetsListProps) {

    return (
        <View className={className}>
          {sets.map((set, index) => (
            <Pressable
              key={index}
              className="bg-card flex-row justify-between items-center mb-2 border-[1px] border-gray-700 px-4 py-4 rounded-xl active:bg-primary"
              onPress={() => handleSetSelected(index)}
            >
              <Text className="text-center text-txt-primary font-bold text-xl">Set {index + 1}</Text>
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
          ))}
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