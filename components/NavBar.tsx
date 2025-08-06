import AntDesign from '@expo/vector-icons/AntDesign';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { router, usePathname } from "expo-router";
import { Pressable, View } from "react-native";

export default function NavBar(props: NativeStackHeaderProps) {
    const pathname = usePathname();

    const renderHeaderRight = () => {
        if (!props.options) return null;
        if (props.options.headerRight) {
            return props.options.headerRight({});
        }
    }

    return (
        <View className='w-full bg-primary py-4 px-4 flex-row justify-between border-b border-tertiary'>
            <Pressable className="" onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={22} color="#3b82f6" />
            </Pressable>
            {/* Show headerRight if its in the options */}
            {renderHeaderRight()}
        </View>
    )
}