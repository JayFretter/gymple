import AntDesign from '@expo/vector-icons/AntDesign';
import { router, usePathname } from "expo-router";
import { useEffect, useState } from 'react';
import { Pressable, View } from "react-native";

const NAVBAR_DISABLED_PATHS = ['/dashboard', '/workout/WorkoutCompletedPage'];

export default function NavBar() {
    const pathname = usePathname();

    if (NAVBAR_DISABLED_PATHS.includes(pathname)) {
        return null;
    }

    return (
        <View className='w-full py-4 px-4 flex-row justify-between border-b border-gray-700'>
            <Pressable className="" onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={22} color="#03a1fc" />
            </Pressable>
        </View>
    )
}