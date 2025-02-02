import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ViewToken, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import WheelPickerItem from './WheelPickerItem';

interface WheelPickerProps {
    data: string[];
    onValueChange: (value: string) => void;
}

export default function WheelPicker({ data, onValueChange }: WheelPickerProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const translateY = useSharedValue(0);
    const viewableItems = useSharedValue<ViewToken[]>([])

    const handleSelect = (index: number) => {
        setSelectedIndex(index);
        onValueChange(data[index]);
        translateY.value = withSpring(-index * 40);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <ScrollView className='w-full h-full'>
            <View className='flex items-center'>
                <FlatList
                    className='w-[95%]'
                    data={data}
                    renderItem={(item) => {
                        return <WheelPickerItem itemIndex={item.index} className='mb-8' itemText={item.item} viewableItems={viewableItems} />
                    }}
                    onViewableItemsChanged={({ viewableItems: items }) => viewableItems.value = items}
                />
            </View>
        </ScrollView>
    );
}