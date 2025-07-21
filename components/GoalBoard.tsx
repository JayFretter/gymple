import { View, Text, TouchableOpacity } from "react-native";
import { GoalTile } from "@/components/GoalTile";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import GoalDefinition from "@/interfaces/GoalDefinition";
import { router } from 'expo-router';
import useStorage from "@/hooks/useStorage";

export interface GoalBoardProps {
    goals?: GoalDefinition[];
}

export default function GoalBoard(props: GoalBoardProps) {
    const isFocused = useIsFocused();
    const [goals, setGoals] = useState<GoalDefinition[]>([]);
    const { fetchFromStorage } = useStorage();

    useEffect(() => {
        if (isFocused) {
            if (props.goals) {
                setGoals(props.goals);
                console.log('Using passed goals:', props.goals);
            }
            else
                fetchGoals();
        }
    }, [isFocused, props.goals]);

    const fetchGoals = () => {
        const storedGoals = fetchFromStorage<GoalDefinition[]>('data_goals') ?? [];
        setGoals(storedGoals);
    }

    const editGoals = () => {
        router.push({ pathname: '/dashboard/ListGoalsPage' });
    }

    return (
        <View className='flex'>
            <View className='flex-row mb-4 w-full justify-end'>
                <TouchableOpacity onPress={editGoals}>
                    <FontAwesome5 name="cog" size={20} color='white' />
                </TouchableOpacity>
            </View>
            {
            goals.length ?
                <View className='flex-row justify-center flex-wrap gap-4 mb-12'>
                    {
                        goals.map((goal, index) => (
                            <GoalTile key={index} goal={goal} />
                        ))
                    }
                </View> :
                <View className='flex items-center justify-center mb-12'>
                    <Text className='text-gray-500'>No goals set yet. Tap on the cog to add a goal.</Text>
                </View>
            }

        </View>
    )
}