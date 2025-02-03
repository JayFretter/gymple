import { Pressable, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from "expo-router";

export default function NavBar() {
    return (
        <View className='w-full h-12 pl-4 flex justify-center'>
            <Pressable onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={24} color="#03a1fc" />
            </Pressable>
        </View>
    )
}