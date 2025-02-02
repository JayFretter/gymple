import React, { useState } from 'react';
import { View, FlatList, Text, ViewToken, TouchableOpacity } from 'react-native';
import WheelPickerItem from './WheelPickerItem';


interface WheelPickerProps {
    data: string[];
    secondaryData?: string[]
    rowsVisible: number;
    rowHeight: number;
    label?: string;
    onItemSelected: (value: string) => void;
}

export default function WheelPicker({ data, secondaryData, rowsVisible, rowHeight, label, onItemSelected }: WheelPickerProps) {
    const [selectedValue, setSelectedValue] = useState<string>(data[0]);
    const [selectedSecondaryValue, setSelectedSecondaryValue] = useState<string>(secondaryData ? secondaryData[0] : '');

    const wheelPickerHeight = rowsVisible * rowHeight;
    const topSeparatorTopOffset = Math.floor(rowsVisible / 2) * rowHeight;
    const bottomSeparatorTopOffset = (Math.floor(rowsVisible / 2) + 1) * rowHeight;
    const separatorThickness = 2;
    const middleIndex = Math.floor(rowsVisible / 2);

    const dummyItemCount = middleIndex;
    const dummyItems = Array.from({ length: dummyItemCount }, (_, i) => '');

    data = [...dummyItems, ...data, ...dummyItems];
    if (secondaryData)
        secondaryData = [...dummyItems, ...secondaryData, ...dummyItems];

    const handleViewableItemsChanged = (viewableItems: ViewToken<string>[], stateFunc: React.Dispatch<React.SetStateAction<string>>) => {
        if (middleIndex > viewableItems.length - 1) {
            return;
        }
        const middleItem = viewableItems[middleIndex];
        stateFunc(middleItem.item);
    }

    const handleSelectButtonPressed = () => {
        var finalSelectedValue = selectedValue;
        if (secondaryData !== null) {
            finalSelectedValue += selectedSecondaryValue;
        }

        onItemSelected(finalSelectedValue);
    }

    return (
        <View>
            <View style={{ height: wheelPickerHeight }} className='w-full flex flex-row bg-slate-800'>
                <FlatList
                    className='w-[40%]'
                    data={data}
                    renderItem={(item) => {
                        return <WheelPickerItem
                            itemIndex={item.index}
                            rowHeight={rowHeight}
                            itemText={item.item}
                            textAlign={label ? 'right' : 'center'}
                        />
                    }}
                    snapToInterval={rowHeight}
                    decelerationRate={'normal'}
                    showsVerticalScrollIndicator={false}
                    onViewableItemsChanged={(info) => handleViewableItemsChanged(info.viewableItems, setSelectedValue)}
                />
                {secondaryData &&
                    <FlatList
                        data={secondaryData}
                        renderItem={(item) => {
                            return <WheelPickerItem
                                itemIndex={item.index}
                                rowHeight={rowHeight}
                                itemText={item.item}
                                textAlign={'center'}
                            />
                        }}
                        snapToInterval={rowHeight}
                        decelerationRate={'normal'}
                        showsVerticalScrollIndicator={false}
                        onViewableItemsChanged={(info) => handleViewableItemsChanged(info.viewableItems, setSelectedSecondaryValue)}
                    />
                }
                {label &&
                    <View className='flex justify-center w-[35%]'>
                        <Text className='text-gray-200 pl-2 text-xl'>{label}</Text>
                    </View>
                }
                

                <View style={{ top: topSeparatorTopOffset - separatorThickness, height: separatorThickness }} className='absolute w-full bg-green-500 z-10' />
                <View style={{ top: bottomSeparatorTopOffset, height: separatorThickness }} className='absolute w-full bg-green-500 z-10' />

            </View>
            <TouchableOpacity
                className="bg-green-900 py-3 rounded-lg mt-4"
                onPress={() => handleSelectButtonPressed()}
            >
                <Text className="text-white text-center font-semibold">Select</Text>
            </TouchableOpacity>
        </View>
    );
}