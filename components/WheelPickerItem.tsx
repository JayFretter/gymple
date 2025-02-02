import React from "react";
import { Text, View } from "react-native";

type WheelPickerItemProps = {
    itemIndex: number;
    itemText: string;
    rowHeight: number;
    rowsVisible: number;
    isLastItem: boolean;
}

const WheelPickerItem = ({itemIndex, itemText, rowHeight, rowsVisible, isLastItem}: WheelPickerItemProps) => {
    const marginTop = itemIndex === 0 ? rowHeight * Math.floor(rowsVisible / 2) : 0;
    const marginBottom = isLastItem ? rowHeight * Math.floor(rowsVisible / 2) : 0;

    return (
        <View style={{height: rowHeight, marginTop: marginTop, marginBottom: marginBottom}} className='flex justify-center'>
            <Text className='w-full text-3xl text-gray-200 text-right'>{itemText}</Text>
        </View>
    )
}

export default React.memo(WheelPickerItem);