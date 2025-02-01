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
}

export default function ExerciseListItem(props: ExerciseListItemProps) {
    const xPosition = useSharedValue(-1000);
    const router = useRouter();

    useEffect(() => {
        changeXPosition();
    }, [])

    const changeXPosition = () => {
        xPosition.value = withSpring(xPosition.value + 1000);
    }

    const handlePress = () => {
        router.back();
        router.setParams({selectedExercise: props.exercise.name});
    }

    const animatedStyle = useAnimatedStyle(() => {
        const isVisible = Boolean(props.viewableItems.value.filter(x => x.isViewable).find(x => x.index === props.itemId));
        return {
            opacity: withTiming(isVisible ? 1 : 0.5),
            transform: [{scale: withTiming(isVisible ? 1 : 0.8)}]
        }
    }, [])

    return (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity className={`bg-slate-700 px-4 py-4 flex items-center justify-center rounded-xl ${props.className}`} onPress={handlePress}>
                <Text className='text-3xl text-green-300 mb-2'>{props.exercise.name}</Text>
                <Text className='text-gray-300'>{props.exercise.notes}</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}