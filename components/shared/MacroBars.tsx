import { Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

const DEFAULT_MAX_BAR_HEIGHT = 48;
const MIN_BAR_HEIGHT = 2;

export interface MacroBarsProps {
  protein: number;
  carbs: number;
  fats: number;
  calories?: number;
  maxBarHeight?: number;
  animated?: boolean;
  hideValues?: boolean;
  shortLabels?: boolean;
  className?: string;
}

export default function MacroBars({ protein, carbs, fats, calories, maxBarHeight = DEFAULT_MAX_BAR_HEIGHT, animated, hideValues, shortLabels, className }: MacroBarsProps) {
  const macros = [
    { value: protein, color: '#D51F31', label: shortLabels ? 'P' : 'Protein' },
    { value: carbs, color: '#419159', label: shortLabels ? 'C' : 'Carbs' },
    { value: fats, color: '#F0B953', label: shortLabels ? 'F' : 'Fats' },
  ];

  const maxMacroValue = Math.max(...macros.map(m => m.value), 1);

  // Shared values for animation
  const barHeights = macros.map(_ => useSharedValue(0));

  useEffect(() => {
    if (animated) {
      macros.forEach((macro, idx) => {
        const targetHeight = maxMacroValue > 0
          ? Math.max((macro.value / maxMacroValue) * maxBarHeight, MIN_BAR_HEIGHT)
          : MIN_BAR_HEIGHT;
        barHeights[idx].value = withTiming(targetHeight, { duration: 600 });
      });
    } else {
      macros.forEach((macro, idx) => {
        const targetHeight = maxMacroValue > 0
          ? Math.max((macro.value / maxMacroValue) * maxBarHeight, MIN_BAR_HEIGHT)
          : MIN_BAR_HEIGHT;
        barHeights[idx].value = targetHeight;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [protein, carbs, fats, maxBarHeight, animated]);

  return (
    <View className={className}>
      <View
        className={"flex-row items-end justify-center"}
        style={{ height: maxBarHeight*1.5 }}
      >
        {macros.map((macro, idx) => {
          const animatedStyle = useAnimatedStyle(() => ({
            height: barHeights[idx].value,
          }));
          return (
            <View key={macro.label} className="items-center flex-1">
              {animated ? (
                <Animated.View
                  style={[
                    {
                      width: 14,
                      backgroundColor: macro.color,
                      borderRadius: 6,
                      marginBottom: 2,
                    },
                    animatedStyle,
                  ]}
                />
              ) : (
                <View
                  style={{
                    height: maxMacroValue > 0
                      ? Math.max((macro.value / maxMacroValue) * maxBarHeight, MIN_BAR_HEIGHT)
                      : MIN_BAR_HEIGHT,
                    width: 14,
                    backgroundColor: macro.color,
                    borderRadius: 6,
                    marginBottom: 2,
                  }}
                />
              )}
              <Text className="text-xs font-bold" style={{ color: macro.color }}>{macro.label}</Text>
              {!hideValues && <Text className="text-xs text-txt-primary">{macro.value}g</Text>}
            </View>
          );
        })}
      </View>
      {(calories ?? 0) > 0 && <Text className="text-xs text-txt-secondary self-center mt-2">{calories} kcal</Text>}
    </View>
  );
}
