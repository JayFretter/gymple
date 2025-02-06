import React from "react";
import { Text, View } from "react-native";

type WheelPickerItemProps = {
    itemIndex: number;
    itemText: string;
    rowHeight: number;
    textAlign: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

const WheelPickerItem = ({itemIndex, itemText, rowHeight, textAlign}: WheelPickerItemProps) => {
    return (
        <View style={{height: rowHeight}} className='flex justify-center'>
            <Text style={{textAlign: textAlign}} className='text-3xl text-gray-800'>{itemText}</Text>
        </View>
    )
}

export default React.memo(WheelPickerItem);