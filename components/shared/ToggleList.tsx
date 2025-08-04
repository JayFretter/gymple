import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";

export interface ToggleListProps {
    options: string[];
    initialOption?: string;
    onOptionSelected?: (option: string) => void;
    className?: string;
    connected?: boolean;
}

export default function ToggleList({ options, initialOption = options[0], onOptionSelected, className, connected }: ToggleListProps) {
    const [selectedOption, setSelectedOption] = useState(initialOption);

    useEffect(() => {
        setSelectedOption(initialOption);
    }, [initialOption]);

    const getRoundedClass = (index: number) => {
        if (!connected) return 'rounded-xl';
        if (index === 0) return 'rounded-l-xl';
        if (index === options.length - 1) return 'rounded-r-xl';
        return '';
    };

    return (
        <View className={`flex-row items-center ${!connected ? 'gap-2' : ''} ${className}`}>
            {options.map((option, index, options) => (
                <TouchableOpacity
                    key={option}
                    className={`px-3 py-1 ${getRoundedClass(index)} ${option === selectedOption ? 'bg-highlight' : 'bg-card'}`}
                    onPress={() => {
                        setSelectedOption(option);
                        onOptionSelected?.(option);
                    }}
                >
                    <Text className={`text-white font-semibold`}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}