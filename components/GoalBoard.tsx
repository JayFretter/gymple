import { View, Text, TouchableOpacity } from "react-native";
import { GoalTile } from "@/components/GoalTile";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import GoalDefinition from "@/interfaces/GoalDefinition";
import { router } from 'expo-router';
import useStorage from "@/hooks/useStorage";
import GradientPressable from "./shared/GradientPressable";
import Feather from "@expo/vector-icons/Feather";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

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
        <View className='flex items-center w-full'>
            <GradientPressable style="default" className='flex-row mb-4 self-end' onPress={editGoals}>
                <View className="flex-row items-center gap-2 px-2 py-1">
                    <Feather name="target" size={12} color="white" />
                    <Text className='text-txt-primary'>Edit Goals</Text>
                </View>
            </GradientPressable>
            {
            goals.length ?
                <View className='flex items-center w-full gap-4 mb-12'>
                    {
                        goals.map((goal, index) => (
                            <GoalTile key={index} goal={goal} />
                        ))
                    }
                </View> :
                <View className='flex mb-12'>
                    <Text className='text-txt-secondary'>No goals set yet.</Text>
                </View>
            }

        </View>
    )
}