import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import GradientPressable from './shared/GradientPressable';
// import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

interface WorkoutTimerProps {
  startSeconds: number;
}

const RestTimer = ({ startSeconds }: WorkoutTimerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(startSeconds);
  const [timerBarWidth, setTimerBarWidth] = useState(100);
  const [minutes, setMinutes] = useState<string>(String(Math.floor(startSeconds / 60)).padStart(2, '0'));
  const [seconds, setSeconds] = useState<string>(String(startSeconds % 60).padStart(2, '0'));

  useEffect(() => {
    setTime(startSeconds);
    setTimerBarWidth(100);
    setMinutes(String(Math.floor(startSeconds / 60)).padStart(2, '0'));
    setSeconds(String(startSeconds % 60).padStart(2, '0'));
  }, [startSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        handleProgress();
        if (time === 0) {
          setIsActive(false);
          return;
        }

        setTime((prevTime) => prevTime - 1);
        setMinutesAndSeconds(time - 1);

      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval!);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const handleProgress = () => {
    setTimerBarWidth((time / startSeconds) * 100);
  };

  const setMinutesAndSeconds = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    setMinutes(String(minutes).padStart(2, '0'));
    setSeconds(String(seconds).padStart(2, '0'));
  }

  const handleStartPause = () => {
    if (!isActive) {
      setTime((parseInt(minutes) * 60) + parseInt(seconds));
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setTime(startSeconds);
    setTimerBarWidth(100);
    setIsActive(false);
  };

  return (
    <View className="flex-1 justify-center items-center">
      <GradientPressable className='self-end' style='default'>
        <View className='px-2 py-1'>
          <Text className='text-white'>Edit</Text>
        </View>
      </GradientPressable>
      <View className='flex-row gap-1 items-center justify-center mb-4'>
        <Text className='text-6xl font-semibold text-txt-secondary font-mono'>{minutes}</Text>
        <Text className='text-6xl font-semibold text-txt-secondary font-mono'>:</Text>
        <Text className='text-6xl font-semibold text-txt-secondary font-mono'>{seconds}</Text>
      </View>
      <View style={{ width: `${timerBarWidth}%` }} className='h-1 bg-[#03a1fc] mb-8 rounded-xl' />
      <View className="flex-row w-full gap-4">
        <GradientPressable
          style='green'
          onPress={handleStartPause}
          className='flex-1'
        >
          <View className='px-6 py-3 flex items-center justify-center'>
            {isActive ? <Ionicons name="pause" size={16} color="white" /> : <Ionicons name="play" size={16} color="white" />}
          </View>
        </GradientPressable>
        <GradientPressable
          style='gray'
          onPress={handleReset}
          className='flex-1'
        >
          <View className='px-6 py-3 items-center justify-center'>
            <Text className="text-white">Reset</Text>
          </View>
        </GradientPressable>
      </View>
    </View>
  );
};

export default RestTimer;