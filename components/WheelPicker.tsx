import React, { useState } from 'react';
import { View, FlatList, Text, ViewToken, TouchableOpacity } from 'react-native';
import WheelPickerItem from './WheelPickerItem';


interface WheelPickerProps {
    data: string[];
    rowsVisible: number;
    rowHeight: number;
    label?: string;
    onItemSelected: (value: string) => void;
}

export default function WheelPicker({ data, rowsVisible, rowHeight, label, onItemSelected }: WheelPickerProps) {
    const [selectedValue, setSelectedValue] = useState<string>(data[0]);

    const wheelPickerHeight = rowsVisible * rowHeight;
    const topSeparatorTopOffset = Math.floor(rowsVisible / 2) * rowHeight;
    const bottomSeparatorTopOffset = (Math.floor(rowsVisible / 2) + 1) * rowHeight;
    const separatorThickness = 2;

    const handleViewableItemsChanged = (viewableItems: ViewToken<string>[]) => {
        const middleIndex = Math.floor(viewableItems.length / 2);
        const middleItem = viewableItems[middleIndex];
        setSelectedValue(middleItem.item);
    }

    return (
        <View>
            <View style={{ height: wheelPickerHeight }} className='w-full flex flex-row bg-slate-800'>
                <FlatList
                    className='flex-1'
                    data={data}
                    renderItem={(item) => {
                        return <WheelPickerItem
                                    itemIndex={item.index}
                                    rowHeight={rowHeight}
                                    rowsVisible={rowsVisible}
                                    itemText={item.item}
                                    isLastItem={item.index === data.length - 1}
                                />
                    }}
                    snapToInterval={rowHeight}
                    decelerationRate={'normal'}
                    onViewableItemsChanged={(info) => handleViewableItemsChanged(info.viewableItems)}
                />
                <View style={{ top: topSeparatorTopOffset - separatorThickness, height: separatorThickness }} className='absolute w-full bg-green-500 z-10' />
                <View style={{ top: bottomSeparatorTopOffset, height: separatorThickness }} className='absolute w-full bg-green-500 z-10' />
                <View className='flex-1 flex justify-center'>
                    <Text className='text-gray-200 pl-2 text-xl'>{label}</Text>
                </View>
            </View>
            <TouchableOpacity
              className="bg-green-900 py-3 rounded-lg mt-4"
              onPress={() => onItemSelected(selectedValue)}
            >
              <Text className="text-white text-center font-semibold">Select</Text>
            </TouchableOpacity>
        </View>
    );
}