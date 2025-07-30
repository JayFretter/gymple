import AntDesign from '@expo/vector-icons/AntDesign';
import { router, usePathname, useRootNavigationState } from "expo-router";
import { Pressable, View, Text } from "react-native";

const NAVBAR_DISABLED_PATHS = ['/dashboard', '/workout/WorkoutCompletedPage'];

export default function NavBar() {
    const pathname = usePathname();

    if (NAVBAR_DISABLED_PATHS.includes(pathname)) {
        return null;
    }

    return (
        <View className='w-full py-4 pl-4 flex justify-center border-b border-gray-700'>
            <Pressable className="flex-row items-center gap-2" onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={22} color="#03a1fc" />
                {/* <Text className="text-white text-lg font-semibold">Workouts</Text> */}
            </Pressable>
        </View>
    )
}