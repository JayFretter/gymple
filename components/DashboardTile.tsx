
import useStorage from '@/hooks/useStorage';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export interface DashboardTileProps {
  title: string;
  metric: 'workoutCount' | string;
  className?: string;
}

export default function DashboardTile({ title, metric, className }: DashboardTileProps) {
  const { fetchFromStorage } = useStorage();
  const [workoutCount, setWorkoutCount] = useState<number>(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (metric === 'workoutCount') {
      const sessions = fetchFromStorage<any[]>('data_sessions') ?? [];
      setWorkoutCount(sessions.length);
    }
  }, [metric, isFocused]);

  return (
    <View className={`bg-card rounded-xl p-4 items-center justify-center shadow-md ${className}`}>
      <Text className="text-txt-secondary font-semibold mb-2">{title}</Text>
      <Text className="text-txt-primary text-5xl font-bold">
        {metric === 'workoutCount' ? workoutCount : '-'}
      </Text>
    </View>
  );
}
