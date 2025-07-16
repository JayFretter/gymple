import { Pressable, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from "expo-router";

export default function NavBar() {
    if (!router.canDismiss()) {
        return null; // Don't render if there's no back navigation available
    }

    return (
        <View className='w-full h-12 pl-4 flex justify-center'>
            <Pressable className="flex-row items-center gap-1" onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={24} color="#03a1fc" />
            </Pressable>
        </View>
    )
}