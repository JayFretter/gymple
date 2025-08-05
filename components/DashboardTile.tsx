
import useStorage from '@/hooks/useStorage';
import useUserStats from '@/hooks/useUserStats';
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
  const { fetchUserStats } = useUserStats();

  useEffect(() => {
    if (metric === 'workoutCount') {
      const sessions = fetchFromStorage<any[]>('data_sessions') ?? [];
      setWorkoutCount(sessions.length);
    } else if (metric === 'weightLifted') {
      const userStats = fetchUserStats();
      setWeightLifted(userStats.totalVolumeInKg);
    }
  }, [metric, isFocused]);

  const renderMetric = () => {
    if (metric === 'workoutCount') {
      return <Text className="text-txt-primary text-2xl font-semibold">{workoutCount}</Text>;
    }
    else if (metric === 'weightLifted') {
      return (
        <View className="flex-row items-center gap-2">
          <Text className="text-txt-primary text-2xl font-semibold">{(weightLifted/1000).toFixed(1)}</Text>
          <Text className="text-txt-secondary text-sm">tonnes</Text>
        </View>
      )
    }
  }

  return (
    <View className={`bg-card rounded-xl p-4 items-center justify-center ${className}`}>
      <Text className="text-txt-secondary font-semibold mb-2">{title}</Text>
      {renderMetric()}
    </View>
  );
}

