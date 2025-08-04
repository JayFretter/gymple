import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, Text, ViewToken, TouchableOpacity, ListRenderItem } from 'react-native';
import WheelPickerItem from './WheelPickerItem';
import { LinearGradient } from 'expo-linear-gradient';


interface WheelPickerProps {
    data: string[];
    rowsVisible: number;
    rowHeight: number;
    label?: string;
    startAtIndex?: number;
    onItemSelected: (value: string) => void;
}

export default function WheelPicker({ data, rowsVisible, rowHeight, label, startAtIndex, onItemSelected }: WheelPickerProps) {
    const listRef = useRef<FlatList<string>>(null);

    const wheelPickerHeight = rowsVisible * rowHeight;
    const topSeparatorTopOffset = Math.floor(rowsVisible / 2) * rowHeight;
    const bottomSeparatorTopOffset = (Math.floor(rowsVisible / 2) + 1) * rowHeight;
    const separatorThickness = 1;
    const middleIndex = Math.floor(rowsVisible / 2);

    const dummyItemCount = middleIndex;
    const dummyItems = Array.from({ length: dummyItemCount }, (_, i) => '');

    useEffect(() => {
        scrollToStartAtIndex();
    }, [listRef, startAtIndex]);

    data = [...dummyItems, ...data, ...dummyItems];

    const handleViewableItemsChanged = (viewableItems: ViewToken<string>[], itemChangeCallback: (item: string) => void) => {
        if (middleIndex > viewableItems.length - 1) {
            return;
        }
        const middleItem = viewableItems[middleIndex];
        itemChangeCallback(middleItem.item);
    }

    const scrollToStartAtIndex = () => {
        if (startAtIndex !== undefined) {
            listRef.current?.scrollToIndex({ index: startAtIndex, animated: true });
        }
    }

    const renderItem = useCallback(({ item } : {item: string}) => (
        <WheelPickerItem
            rowHeight={rowHeight}
            itemText={item}
            textAlign={label ? 'right' : 'center'}
        />
    ), []);

    return (
        <View
            style={{ height: wheelPickerHeight }}
            className='flex flex-row bg-card rounded-md overflow-hidden'
        >
            <FlatList
                className='mx-2 z-10'
                data={data}
                removeClippedSubviews={true}
                renderItem={renderItem}
                snapToInterval={rowHeight}
                decelerationRate={'normal'}
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={(info) => handleViewableItemsChanged(info.viewableItems, onItemSelected)}
                getItemLayout={(_, index) => { return { length: rowHeight, offset: rowHeight * index, index } }}
                ref={listRef}
            />
            {label &&
                <View className='flex justify-center w-[35%]'>
                    <Text className='text-txt-secondary pl-2 text-xl'>{label}</Text>
                </View>
            }


            {/* <View style={{ top: topSeparatorTopOffset - separatorThickness, height: separatorThickness }} className='absolute w-full bg-gray-700 z-10' />
            <View style={{ top: bottomSeparatorTopOffset, height: separatorThickness }} className='absolute w-full bg-gray-700 z-10' /> */}
            <View
                onStartShouldSetResponder={() => true}
                style={{ top: topSeparatorTopOffset + (rowHeight * 0.15)/2, height: rowHeight * 0.85 }}
                className='absolute w-full bg-highlight rounded-xl'
            />

            <LinearGradient pointerEvents='none' className='w-full h-full absolute z-10' colors={['#111111', '#00000000', '#111111']} />
        </View>

    );
}