import { View, Text, TouchableOpacity } from "react-native";
import { GoalTile } from "@/components/GoalTile";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { storage } from '@/storage';
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import GoalDefinition from "@/interfaces/GoalDefinition";

export default function GoalBoard() {
    const isFocused = useIsFocused();
    const [goals, setGoals] = useState<GoalDefinition[]>([]);

    useEffect(() => {
        if (isFocused)
            fetchGoals();
    }, [isFocused]);

    const fetchGoals = () => {
        const storedGoalsString = storage.getString('data_goals');
        const storedGoals: GoalDefinition[] = storedGoalsString ? JSON.parse(storedGoalsString) : [];
        setGoals(storedGoals);
    }

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
                {
                    goals.map((goal, index) => (
                        <GoalTile key={index} goalName={goal.title} percentage={goal.percentage} />
                    ))
                }
            </View>
        </View>
    )
}