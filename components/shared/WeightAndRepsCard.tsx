import FontAwesome from "@expo/vector-icons/FontAwesome";
import { View, Text } from "react-native";

export interface WeightAndRepsCardProps {
  setNumber: number;
  weight: number;
  reps: number;
  weightUnit: string;
}

export default function WeightAndRepsCard({ setNumber, weight, reps, weightUnit }: WeightAndRepsCardProps) {
    return (
        <View
            className="flex-row gap-8 items-center"
        >
            <Text className="text-center text-txt-secondary font-bold">Set {setNumber}</Text>
            <View className='flex-row justify-between items-center gap-4'>
                <View className='flex-row gap-1 items-center justify-center'>
                    <Text className='text-txt-primary font-semibold text-md'>{weight}</Text>
                    <Text className='text-txt-secondary'>{weightUnit}</Text>
                </View>
                <FontAwesome name="times" size={14} color="#9ca3af" />
                <View className='flex-row gap-1 items-center justify-center'>
                    <Text className='text-txt-primary font-semibold text-md'>{reps}</Text>
                    <Text className='text-txt-secondary'>reps</Text>
                </View>
            </View>
        </View>
    );
}