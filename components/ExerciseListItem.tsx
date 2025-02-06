import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { TouchableOpacity, Text, View, ViewToken } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

type ExerciseListItemProps = {
    itemId: number;
    className?: string;
    exercise: ExerciseDefinition;
    viewableItems: SharedValue<ViewToken[]>
    onPress: (exercise: ExerciseDefinition) => void;
}

export default function ExerciseListItem({itemId, className, exercise, viewableItems, onPress}: ExerciseListItemProps) {
    const xPosition = useSharedValue(-1000);
    const router = useRouter();

    useEffect(() => {
        changeXPosition();
    }, [])

    const changeXPosition = () => {
        xPosition.value = withSpring(xPosition.value + 1000);
    }

    const animatedStyle = useAnimatedStyle(() => {
        const isVisible = Boolean(viewableItems.value.filter(x => x.isViewable).find(x => x.index === itemId));
        return {
            opacity: withTiming(isVisible ? 1 : 0.5),
            transform: [{scale: withTiming(isVisible ? 1 : 0.8)}]
        }
    }, [])

    return (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity className={`bg-white px-4 py-4 flex items-center justify-center rounded-xl ${className}`} onPress={() => onPress(exercise)}>
                <Text className='text-3xl text-black mb-2'>{exercise.name}</Text>
                {exercise.notes && <Text className='text-gray-300'>{exercise.notes}</Text>}
                
            </TouchableOpacity>
        </Animated.View>
    )
}