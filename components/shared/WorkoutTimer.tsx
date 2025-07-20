import React, { useEffect, useState } from 'react';
import useCurrentWorkoutStore from '@/hooks/useCurrentWorkoutStore';
import { View, Text } from 'react-native';

export type WorkoutTimerProps = {
  className?: string;
};

export default function WorkoutTimer({className}: WorkoutTimerProps) {
  const currentWorkout = useCurrentWorkoutStore(state => state.currentWorkout);
  const workoutStartedTimestamp = useCurrentWorkoutStore(state => state.workoutStartedTimestamp);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    updateElapsedTime();
  }, [])

  useEffect(() => {
      const interval = setInterval(() => {
        updateElapsedTime();
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    
  }, [workoutStartedTimestamp]);

  const updateElapsedTime = () => {
    if (workoutStartedTimestamp) {
      const now = Date.now();
      setElapsedTime(now - workoutStartedTimestamp);
    }
  }

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);

    if (totalSeconds < 0)
      return '0m 0s'; // Handle negative time

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <View className={className}>
      <Text className='text-txt-secondary'>
        {currentWorkout?.title}: {workoutStartedTimestamp ? formatTime(elapsedTime) : '0m 0s'}
      </Text>
    </View>
  );
}
