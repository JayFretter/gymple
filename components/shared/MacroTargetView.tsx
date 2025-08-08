import { Text, View } from 'react-native';

interface MacroTargetViewProps {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  calorieTarget?: number;
  proteinTarget?: number;
  fatTarget?: number;
  carbTarget?: number;
  className?: string;
}

interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
}

function ProgressBar({ value, max, color }: ProgressBarProps) {
  const percent = Math.min(value / (max || 1), 1);
  return (
    <View className="w-full h-2 bg-tertiary rounded-full overflow-hidden mt-1 mb-1">
      <View style={{ width: `${percent * 100}%`, backgroundColor: color }} className="h-full rounded-full" />
    </View>
  );
}

interface MacroItemProps {
  label: string;
  value: number;
  target?: number;
  color: string;
  unit?: string;
}

function MacroItem({ label, value, target, color, unit }: MacroItemProps) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-xs text-txt-secondary mb-0.5">{label}</Text>
      {target !== undefined ? (
        <ProgressBar value={value} max={target} color={color} />
      ) : null}
      <Text className="text-base font-bold text-txt-primary">
        {value}
        {unit ? <Text className="text-xs font-normal text-txt-secondary">{unit}</Text> : null}
        {target !== undefined ? (
          <Text className="text-xs font-normal text-txt-secondary"> / {target}{unit ?? ''}</Text>
        ) : null}
      </Text>
    </View>
  );
}

export default function MacroTargetView({
  calories,
  protein,
  fats,
  carbs,
  calorieTarget,
  proteinTarget,
  fatTarget,
  carbTarget,
  className
}: MacroTargetViewProps) {
  const calorieColor = '#3B5BA9';
  const proteinColor = '#6FCF97';
  const fatColor = '#F2994A';
  const carbColor = '#56CCF2';

  return (
    <View className={`flex-row justify-between gap-4 w-full ${className ?? ''}`}>
      <MacroItem
        label="Calories"
        value={calories}
        target={calorieTarget}
        color={calorieColor}
      />
      <MacroItem
        label="Protein"
        value={protein}
        target={proteinTarget}
        color={proteinColor}
        unit="g"
      />
      <MacroItem
        label="Fat"
        value={fats}
        target={fatTarget}
        color={fatColor}
        unit="g"
      />
      <MacroItem
        label="Carbs"
        value={carbs}
        target={carbTarget}
        color={carbColor}
        unit="g"
      />
    </View>
  );
}