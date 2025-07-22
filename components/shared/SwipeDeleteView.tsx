import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect } from "react";
import { Dimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH / 5;

export type SwipeDeleteViewProps = {
    className?: string;
    children?: React.ReactNode;
    onDismiss?: () => void;
    swipeDisabled?: boolean;
}

export default function SwipeDeleteView({ className, children, onDismiss, swipeDisabled}: SwipeDeleteViewProps) {
    const translateX = useSharedValue(0);
    const deleteIconOpacity = useSharedValue(0);

    useEffect(() => {
        translateX.value = 0;
    }, [children]);

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (swipeDisabled)
                return;

            if (e.translationX < 0) {
                translateX.value = e.translationX;
                deleteIconOpacity.value = (e.translationX / TRANSLATE_X_THRESHOLD);
            }
        })
        .onEnd((e) => {
            if (swipeDisabled)
                return;

            const shouldBeDismissed = e.translationX < TRANSLATE_X_THRESHOLD;
            if (shouldBeDismissed) {
                translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 }, (finished) => {
                    if (finished && onDismiss) {
                        runOnJS(onDismiss)();
                    }
                });
            } else {
                translateX.value = withTiming(0, { duration: 100 });
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const animatedIconStyle = useAnimatedStyle(() => {
        const opacity = withTiming(translateX.value < TRANSLATE_X_THRESHOLD ? 1 : 0, { duration: 300 });
        return { opacity };
    });

    return (
        <View className={className}>
            <GestureDetector gesture={panGesture}>
                <Animated.View className='z-10' style={[animatedStyle]}>
                    {children}
                </Animated.View>
            </GestureDetector>
            <Animated.View className="absolute top-1/2 right-2 -translate-y-1/2" style={[animatedIconStyle]}>
                <FontAwesome name="trash-o" size={24} color="red" />
            </Animated.View>
        </View>

    );
}