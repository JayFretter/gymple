import { View, Text, TouchableOpacity } from "react-native";
import { GoalTile } from "@/components/GoalTile";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function GoalBoard() {
    const editGoals = () => {
        console.log('editing goals');
    }

    return (
        <View className='flex flex-col'>
            <View className='flex-row px-4 mb-4 items-center justify-between'>
                <Text className='text-xl font-semibold'>Goals</Text>
                <TouchableOpacity onPress={editGoals}>
                    <FontAwesome5 name="cog" size={20} color="black" />
                </TouchableOpacity>
            </View>
            <View className='flex-row flex-wrap justify-center gap-4 mb-12'>
                <GoalTile goalName='Bench Press 110 kg' percentage={95} />
                <GoalTile goalName='Perform 12 Pull-Ups' percentage={100} />
                <GoalTile goalName='Barbell Row 100 kg' percentage={92.5} />
                <GoalTile goalName='Bicep Curl 30 kg' percentage={80} />
            </View>
        </View>
    )
}