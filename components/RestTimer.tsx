import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import GradientPressable from './shared/GradientPressable';
// import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAudioPlayer } from 'expo-audio';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const TIMER_BEEP_SOURCE = require('@/assets/sounds/rest_timer_alarm.wav');
const MIN_BAR_WIDTH_PERCENTAGE: number = 2;

interface WorkoutTimerProps {
  startSeconds: number;
}

const RestTimer = ({ startSeconds }: WorkoutTimerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(startSeconds);
  const [timerBarWidth, setTimerBarWidth] = useState(100);
  const [minutes, setMinutes] = useState<string>(String(Math.floor(startSeconds / 60)).padStart(2, '0'));
  const [seconds, setSeconds] = useState<string>(String(startSeconds % 60).padStart(2, '0'));
  const player = useAudioPlayer(TIMER_BEEP_SOURCE);

  useEffect(() => {
    resetTimer();
  }, [startSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        const newTime = time - 1;
        setTimerBarWidth(Math.max((newTime / startSeconds) * 100, MIN_BAR_WIDTH_PERCENTAGE));
        setTime(newTime);
        setMinutesAndSeconds(newTime);

        if (newTime === 0) {
          setIsActive(false);
          player.seekTo(0);
          player.play();
        }
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval!);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const setMinutesAndSeconds = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    setMinutes(String(minutes).padStart(2, '0'));
    setSeconds(String(seconds).padStart(2, '0'));
  }

  const handleStartPause = () => {
    if (!isActive) {
      resetTimer();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTime(startSeconds);
    setTimerBarWidth(100);
    setMinutes(String(Math.floor(startSeconds / 60)).padStart(2, '0'));
    setSeconds(String(startSeconds % 60).padStart(2, '0'));
  }

  const handleResetButtonPressed = () => {
    resetTimer();
    setIsActive(false);
  };

  const animatedBarStyle = useAnimatedStyle(() => {
    return { 
      width: withTiming(`${timerBarWidth}%`, { duration: 1000, easing: Easing.linear }),
      backgroundColor: withTiming(time > 5 ? '#03a1fc' : '#ef4444', {duration: 500})
    }
  })

  return (
    <View className="flex-1 justify-center items-center">
      <View className='flex-row items-center justify-center gap-8 mb-4'>

        <View className='flex-row items-center gap-2'>
          <Text className='text-xl font-semibold text-txt-secondary font-mono'>Rest</Text>
          <Ionicons name="timer-outline" size={16} color="#AAAAAA" />
        </View>
        <View className='flex-row gap-1 items-center justify-center'>
          <Text className='text-6xl font-semibold text-txt-primary font-mono'>{minutes}</Text>
          <Text className='text-6xl font-semibold text-txt-primary font-mono'>:</Text>
          <Text className='text-6xl font-semibold text-txt-primary font-mono'>{seconds}</Text>
        </View>
      </View>
      <Animated.View style={animatedBarStyle} className='h-1 mb-8 rounded-xl' />
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
          onPress={handleResetButtonPressed}
          className='flex-1'
        >
          <View className='px-6 py-3 items-center justify-center'>
            <FontAwesome name="undo" size={16} color="white" />
          </View>
        </GradientPressable>
      </View>
    </View>
  );
};

export default RestTimer;