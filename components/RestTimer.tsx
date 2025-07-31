import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import GradientPressable from './shared/GradientPressable';
import { useAudioPlayer } from 'expo-audio';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const TIMER_BEEP_SOURCE = require('@/assets/sounds/rest_timer_alarm.wav');
const MIN_BAR_WIDTH_PERCENTAGE: number = 1;

interface WorkoutTimerProps {
  startSeconds: number;
  onEditPressed?: () => void;
}

const RestTimer = ({ startSeconds, onEditPressed }: WorkoutTimerProps) => {
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
    if (!isActive && time <= 0) {
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
      backgroundColor: withTiming(time > 5 ? '#03a1fc' : '#ef4444', { duration: 500 })
    }
  })

  return (
    <View className="flex justify-center items-center">
      <View className='flex-row items-center justify-between w-full gap-4 mb-4'>
        <Pressable className='flex-row active:opacity-75' onPress={onEditPressed} disabled={isActive}>
            <View className='flex-row items-center gap-2'>
              <Text className='text-lg font-semibold text-txt-secondary'>Rest</Text>
              {/* <Ionicons name="timer-outline" size={14} color="#AAAAAA" /> */}
            </View>
            <View className='ml-4'>
              <View className='flex-row items-center justify-center'>
                <Text className='text-4xl text-txt-primary'>{minutes}</Text>
                <Text className='text-4xl text-txt-primary'>:</Text>
                <Text className='text-4xl text-txt-primary'>{seconds}</Text>
              </View>
              { !isActive && <Text className='text-xs text-txt-secondary'>(Tap to edit)</Text>}
            </View>
          
          {/* { !isActive && <MaterialCommunityIcons className='self-start ml-1' name="pencil" size={10} color="#AAAAAA" />} */}
        </Pressable>
        <View className="flex-row gap-4">
          <GradientPressable
            style={isActive ? 'red' : 'green'}
            onPress={handleStartPause}
            className=''
          >
            <View className='px-8 py-2 flex items-center justify-center'>
              {isActive ? <Ionicons name="pause" size={14} color="white" /> : <Ionicons name="play" size={14} color="white" />}
            </View>
          </GradientPressable>
          <GradientPressable
            style='gray'
            onPress={handleResetButtonPressed}
            className=''
          >
            <View className='px-8 py-2 items-center justify-center'>
              <FontAwesome name="undo" size={14} color="white" />
            </View>
          </GradientPressable>
        </View>
      </View>
      <View className="h-1 mb-4 rounded-xl w-full bg-card overflow-hidden">
        <Animated.View style={animatedBarStyle} className='h-full' />
      </View>
    </View>
  );
};

export default RestTimer;