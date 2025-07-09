import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity, Text } from "react-native";

type FilterListItemProps = {
    itemIdx: number;
    name: string;
    selected: boolean;
    onPressFn: (itemId: number) => void;
}

export default function FilterListItem({ itemIdx, name, selected, onPressFn }: FilterListItemProps) {

    return (
        selected ?
            <TouchableOpacity className='bg-green-600 px-4 py-2 rounded-lg flex flex-row gap-1 items-center' onPress={() => onPressFn(itemIdx)}>
                <Text className='text-white text-lg'>{name}</Text>
                <AntDesign name="check" size={12} color="white" />
            </TouchableOpacity> 
            :
            <TouchableOpacity className='bg-gray-500 px-4 py-2 rounded-lg flex flex-row gap-1 items-center' onPress={() => onPressFn(itemIdx)}>
                <Text className='text-white text-lg'>{name}</Text>
            </TouchableOpacity>
    )
}