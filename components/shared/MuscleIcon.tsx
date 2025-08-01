import { View, Image } from "react-native";

const imageSources: Record<string, any> = {
  'bicep': require('@/assets/images/muscle_icon_bicep.png'),
  'tricep': require('@/assets/images/muscle_icon_tricep.png'),
  'back': require('@/assets/images/muscle_icon_back.png'),
  'chest': require('@/assets/images/muscle_icon_chest.png'),
  'shoulders': require('@/assets/images/muscle_icon_shoulders.png'),
  'abs': require('@/assets/images/muscle_icon_abs.png'),
  'hamstrings': require('@/assets/images/muscle_icon_hamstrings.png'),
  'calves': require('@/assets/images/muscle_icon_calves.png'),
}

export interface MuscleIconProps {
  muscle: 'bicep' | 'tricep' | 'back' | 'chest' | 'shoulders' | 'abs' | 'hamstrings' | 'calves';
  size: number;
}

export default function MuscleIcon({ muscle, size }: MuscleIconProps) {

  return (
    <View className="flex items-center justify-center p-1 rounded-xl overflow-hidden">
      <Image
        source={imageSources[muscle]}
        style={{ width: size, height: size }}
      />
    </View>
  )
}