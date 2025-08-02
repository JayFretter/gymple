import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import { TouchableOpacity, Text, View } from "react-native";
import MuscleIcon from "./shared/MuscleIcon";

type ExerciseListItemProps = {
    className?: string;
    exercise: ExerciseDefinition;
    isSelected: boolean;
    onPress: (exercise: ExerciseDefinition) => void;
}

export default function ExerciseListItem({ className, exercise, isSelected, onPress }: ExerciseListItemProps) {
    return (
        <TouchableOpacity className={`${isSelected ? 'bg-[#2a53b5]' : 'bg-card'} px-4 py-3 flex-row gap-4 items-center rounded-xl ${className}`} onPress={() => onPress(exercise)}>
            <MuscleIcon category={exercise.categories[0]} size={30} />
            <View>
                <Text className='text-xl text-txt-primary'>{exercise.name}</Text>
                {
                    isSelected && <Text className='text-txt-secondary text-sm'>Selected</Text>
                }
            </View>
        </TouchableOpacity>
    )
}