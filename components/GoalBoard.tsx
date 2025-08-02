import { GoalTile } from "@/components/GoalTile";
import useStorage from "@/hooks/useStorage";
import GoalDefinition from "@/interfaces/GoalDefinition";
import { useIsFocused } from "@react-navigation/native";
import { router } from 'expo-router';
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export interface GoalBoardProps {
    goals?: GoalDefinition[];
    isForSingleExercise?: boolean;
    className?: string;
}

export default function GoalBoard({ goals, isForSingleExercise, className }: GoalBoardProps) {
    const isFocused = useIsFocused();
    const [displayedGoals, setDisplayedGoals] = useState<GoalDefinition[]>([]);
    const { fetchFromStorage } = useStorage();

    useEffect(() => {
        if (isFocused) {
            if (goals) {
                setDisplayedGoals(goals);
            }
            else
                fetchGoals();
        }
    }, [isFocused, goals]);

    const fetchGoals = () => {
        const storedGoals = fetchFromStorage<GoalDefinition[]>('data_goals') ?? [];
        setDisplayedGoals(storedGoals);
    }

    const editGoals = () => {
        router.push({ pathname: '/dashboard/ListGoalsPage' });
    }

    return (
        <View className={`flex w-full ${className}`}>
            <Pressable className="mb-2 self-end px-4" onPress={editGoals}>
                <Text className='text-blue-500'>Edit Goals</Text>
            </Pressable>
            {
                displayedGoals.length ?
                    <View className='flex items-center w-full gap-4 mb-12'>
                        {
                            displayedGoals.map((goal, index) => (
                                <GoalTile key={index} goal={goal} />
                            ))
                        }
                    </View> :
                    <View className='flex-row gap-1 mb-12'>
                        {isForSingleExercise ?
                            <Text className='text-txt-secondary'>No goals set for this exercise.</Text> :
                            <Text className='text-txt-secondary'>No goals set yet.</Text>
                        }
                        {/* <Pressable onPress={editGoals}>
                            <Text className='text-blue-500'>Tap here to edit goals.</Text>
                        </Pressable> */}
                    </View>
            }

        </View>
    )
}