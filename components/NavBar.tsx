import AntDesign from '@expo/vector-icons/AntDesign';
import { router, usePathname } from "expo-router";
import { Pressable, View } from "react-native";

const NAVBAR_DISABLED_PATHS = ['/dashboard', '/workout/WorkoutCompletedPage'];

export default function NavBar() {
    const pathname = usePathname();

    if (NAVBAR_DISABLED_PATHS.includes(pathname)) {
        return null;
    }

    return (
        <View className='w-full py-2 pl-4 flex justify-center'>
            <Pressable className="flex-row items-center gap-1" onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={24} color="#03a1fc" />
            </Pressable>
        </View>
    )
}