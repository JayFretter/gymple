import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import { TouchableOpacity, Text, View } from "react-native";

type ExerciseListItemProps = {
    className?: string;
    exercise: ExerciseDefinition;
    isSelected: boolean;
    onPress: (exercise: ExerciseDefinition) => void;
}

export default function ExerciseListItem({ className, exercise, isSelected, onPress }: ExerciseListItemProps) {
    return (
        <TouchableOpacity className={`bg-card px-4 py-4 flex items-center justify-center rounded-xl ${className}`} onPress={() => onPress(exercise)}>
            <Text className='text-2xl text-txt-primary'>{exercise.name}</Text>
            {
                isSelected && <Text className='text-green-500 text-sm'>Selected</Text>
            }
        </TouchableOpacity>
    )
}