import { ExerciseCategory } from "@/enums/exercise-category";
import { View, Image } from "react-native";

const imageSources: { [key in ExerciseCategory]: any } = {
  [ExerciseCategory.Biceps]: require('@/assets/images/muscle_icon_bicep.png'),
  [ExerciseCategory.Triceps]: require('@/assets/images/muscle_icon_tricep.png'),
  [ExerciseCategory.Back]: require('@/assets/images/muscle_icon_back.png'),
  [ExerciseCategory.Chest]: require('@/assets/images/muscle_icon_chest.png'),
  [ExerciseCategory.Shoulders]: require('@/assets/images/muscle_icon_shoulders.png'),
  [ExerciseCategory.Abs]: require('@/assets/images/muscle_icon_abs.png'),
  [ExerciseCategory.Quadriceps]: require('@/assets/images/muscle_icon_quadriceps.png'),
  [ExerciseCategory.Hamstrings]: require('@/assets/images/muscle_icon_hamstrings.png'),
  [ExerciseCategory.Calves]: require('@/assets/images/muscle_icon_calves.png'),
  [ExerciseCategory.Glutes]: require('@/assets/images/muscle_icon_glutes.png'),
  [ExerciseCategory.Cardio]: require('@/assets/images/muscle_icon_cardio.png'),
  [ExerciseCategory.Miscellaneous]: require('@/assets/images/muscle_icon_misc.png')
}

export interface MuscleIconProps {
  category: ExerciseCategory;
  size: number;
}

export default function MuscleIcon({ category, size }: MuscleIconProps) {

  return (
    <View className="flex items-center justify-center p-1 bg-tertiary rounded-full overflow-hidden">
      <Image
        source={imageSources[category]}
        style={{ width: size, height: size }}
      />
    </View>
  )
}