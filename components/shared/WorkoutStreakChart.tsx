
import {
  addStreakDay,
  getStreakChartDays,
  getTotalStreakDays,
  StreakDay,
  validateAndResetStreakIfNeeded
} from '@/utils/workoutStreak';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import GradientPressable from './GradientPressable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useThemeColours from '@/hooks/useThemeColours';

interface WorkoutStreakChartProps {
  className?: string;
  onRestDayLogged?: () => void;
}

export default function WorkoutStreakChart({ className, onRestDayLogged }: WorkoutStreakChartProps) {
  const [days, setDays] = useState<StreakDay[]>([]);
  const [totalStreakLength, setTotalStreakLength] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const isFocused = useIsFocused();
  const themeColour = useThemeColours();

  useEffect(() => {
    validateAndResetStreakIfNeeded();
    fetchStreakData();
    setLoading(false);
  }, [isFocused]);

  const handleLogRestDay = () => {
    addStreakDay('rest');
    fetchStreakData();
    if (onRestDayLogged) onRestDayLogged();
  };

  const fetchStreakData = () => {
    setDays(getStreakChartDays());
    setTotalStreakLength(getTotalStreakDays());
  }

  const renderChart = () => {
    return (
      <View className="flex-row items-center justify-center mb-2">
        {days.map((day, idx) => (
          <View key={day.date} className="flex-row items-center">
            <View
              className={`w-8 h-8 rounded-full border mx-1 flex items-center justify-center 
                ${day.type === 'workout' ? 'bg-green-500 border-green-700' :
                  day.type === 'rest' ? 'bg-blue-500 border-blue-800' :
                    idx === days.length - 1 ? 'bg-card border-blue-500' :
                      'bg-card border-tertiary'}`}
            >
              <Text className="text-white font-bold text-lg">
                {day.type === 'workout' ? 'W' : day.type === 'rest' ? 'R' : ''}
              </Text>
            </View>
            {idx < days.length - 1 && (
              <View className="w-4 h-1 bg-card self-center" />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderLogRestDayButton = () => {
    if (isTodayWorkout()) {
      return (
        <GradientPressable
          style="gray"
          className='mt-2'
          disabled
        >
          <View className="flex-row items-center gap-2 px-4 py-1">
            <Text className="text-white font-semibold text-sm">Workout Logged</Text>
            <MaterialCommunityIcons name="check" size={12} color="white" />
          </View>
        </GradientPressable>
      )
    }

    return (
      <GradientPressable
        style="gray"
        className='mt-2'
        disabled={isTodayRest()}
        onPress={handleLogRestDay}
      >
        <View className="flex-row items-center gap-2 px-4 py-1">
          {isTodayRest() ? (
            <>
              <Text className="text-txt-secondary font-semibold text-sm">Rest Day Logged</Text>
              <MaterialCommunityIcons name="check" size={12} color={themeColour('txt-secondary')} />
            </>
          ) : (
            <>
              <Text className="text-txt-secondary font-semibold text-sm">Log Rest Day</Text>
              <MaterialCommunityIcons name="bed" size={12} color={themeColour('txt-secondary')} />
            </>
          )}
        </View>
      </GradientPressable>
    );
  }

  const isTodayRest = () => {
    return days.some((d) => d.date === new Date().toISOString().slice(0, 10) && d.type === 'rest');
  };

  const isTodayWorkout = () => {
    return days.some((d) => d.date === new Date().toISOString().slice(0, 10) && d.type === 'workout');
  };

  return (
    <View className={`items-center ${className}`}>
      <Text className="text-txt-primary text-xl font-semibold mb-1">Workout Streak 🔥</Text>
      <Text className="text-txt-secondary text-sm mb-2">Total streak: {totalStreakLength}</Text>
      {loading ? <Text className="text-txt-secondary">Loading...</Text> : renderChart()}
      {renderLogRestDayButton()}
    </View>
  );
}