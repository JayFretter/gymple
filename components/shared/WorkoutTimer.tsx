import useOngoingWorkoutStore from '@/hooks/useOngoingWorkoutStore';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, Text } from 'react-native';

export type WorkoutTimerProps = {
  className?: string;
};

export default function WorkoutTimer({ className }: WorkoutTimerProps) {
  const ongoingWorkoutId = useOngoingWorkoutStore(state => state.workoutId);
  const ongoingWorkoutName = useOngoingWorkoutStore(state => state.workoutName);
  const workoutStartedTimestamp = useOngoingWorkoutStore(state => state.workoutStartedTimestamp);
  const workoutFinishedTimestamp = useOngoingWorkoutStore(state => state.workoutFinishedTimestamp);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    updateElapsedTime();
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      updateElapsedTime();
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount

  }, [workoutStartedTimestamp, workoutFinishedTimestamp]);

  const updateElapsedTime = () => {
    if (workoutStartedTimestamp) {
      if (workoutFinishedTimestamp) {
        setElapsedTime(workoutFinishedTimestamp - workoutStartedTimestamp);
        return;
      }

      const now = Date.now();
      setElapsedTime(now - workoutStartedTimestamp);
    }
  }

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);

    if (totalSeconds < 0)
      return '0s'; // Handle negative time

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = totalSeconds % 60;

    let parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    
    return parts.join(' ');
  };

  return ( 
    <Pressable className={className} onPress={() => router.push({ pathname: '/workout/ViewWorkoutPage', params: { workoutId: ongoingWorkoutId } })}>
      <Text className='text-white text-center'>{ongoingWorkoutName}: {workoutStartedTimestamp ? formatTime(elapsedTime) : '0m 0s'}</Text>
    </Pressable>
  );
}
