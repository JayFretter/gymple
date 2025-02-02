import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { TouchableOpacity, Text, View, ViewToken } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

type WheelPickerItemProps = {
    itemIndex: number;
    className?: string;
    itemText: string;
    viewableItems: SharedValue<ViewToken[]>
}

export default function WheelPickerItem(props: WheelPickerItemProps) {
    const xPosition = useSharedValue(-1000);
    const router = useRouter();

    useEffect(() => {
        changeXPosition();
    }, [])

    const changeXPosition = () => {
        xPosition.value = withSpring(xPosition.value + 1000);
    }

    const handlePress = () => {
        console.log('pressed:', props.itemText);
    }

    const animatedStyle = useAnimatedStyle(() => {
        const isVisible = Boolean(props.viewableItems.value.filter(x => x.isViewable).find(x => x.index === props.itemIndex));
        return {
            opacity: withTiming(isVisible ? 1 : 0.5),
            transform: [{scale: withTiming(isVisible ? 1 : 0.8)}]
        }
    }, [])

    return (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity className={`bg-slate-700 px-4 py-4 flex items-center justify-center rounded-xl ${props.className}`} onPress={handlePress}>
                <Text className='text-3xl text-gray-200 mb-2'>{props.itemText}</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}