import { Text, View } from "react-native";

export type LevelBarProps = {
    className?: string;
    currentLevel: number;
    percentage: number;
}

export default function LevelBar({ className, currentLevel, percentage } : LevelBarProps) {
    return (
        <View className={className + ' flex-row w-full items-center justify-between gap-2'}>
            <Text className='text-txt-secondary text-xs'>Level {currentLevel}</Text>
            <View className='h-[2px] bg-gray-700 flex-grow rounded-full overflow-hidden'>
                <View className={`h-full bg-[#4973d6]`} style={{ width: `${percentage}%` }} />
            </View>
            <Text className='text-txt-secondary text-xs'>{currentLevel + 1}</Text>
        </View>
    );
}