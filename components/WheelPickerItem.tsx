import React, { memo } from "react";
import { Text, View } from "react-native";

type WheelPickerItemProps = {
    itemText: string;
    rowHeight: number;
    textAlign: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

const WheelPickerItem = ({itemText, rowHeight, textAlign}: WheelPickerItemProps) => {
    return (
        <View style={{height: rowHeight}} className='flex justify-center'>
            <Text style={{textAlign: textAlign}} className='text-5xl text-txt-primary'>{itemText}</Text>
        </View>
    )
}

export default memo(WheelPickerItem);