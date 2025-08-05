
import useStorage from '@/hooks/useStorage';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export interface DashboardTileProps {
  title: string;
  metric: 'workoutCount' | 'weightLifted';
  className?: string;
}

export default function DashboardTile({ title, metric, className }: DashboardTileProps) {
  const { fetchFromStorage } = useStorage();
  const [workoutCount, setWorkoutCount] = useState<number>(0);
  const [weightLifted, setWeightLifted] = useState<number>(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (metric === 'workoutCount') {
      const sessions = fetchFromStorage<any[]>('data_sessions') ?? [];
      setWorkoutCount(sessions.length);
    }
  }, [metric, isFocused]);

  const renderMetric = () => {
    if (metric === 'workoutCount') {
      return <Text className="text-txt-primary text-5xl font-bold">{workoutCount}</Text>;
    }
    else if (metric === 'weightLifted') {
      return (
        <View className="flex-row items-end gap-1">
          <Text className="text-txt-primary text-5xl font-bold">{weightLifted}</Text>
          <Text className="text-txt-secondary text-xl">kg</Text>
        </View>
      )
    }
  }

  return (
    <View className={`bg-card rounded-xl p-4 items-center justify-center shadow-md ${className}`}>
      <Text className="text-txt-secondary font-semibold mb-2">{title}</Text>
      {renderMetric()}
    </View>
  );
}

