import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import GradientPressable from './shared/GradientPressable';
import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';

const TIMER_BEEP_SOURCE = require('@/assets/sounds/rest_timer_alarm.wav');
const MIN_BAR_WIDTH_PERCENTAGE: number = 0;
const NOTIFICATION_ID = 'rest_timer_notification';

interface WorkoutTimerProps {
  startSeconds: number;
  onEditPressed?: () => void;
  className?: string;
}

const RestTimer = ({ startSeconds, onEditPressed, className }: WorkoutTimerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [finishTimestamp, setFinishTimestamp] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(startSeconds);
  const [timerBarWidth, setTimerBarWidth] = useState(100);
  const [minutes, setMinutes] = useState<string>(String(Math.floor(startSeconds / 60)).padStart(2, '0'));
  const [seconds, setSeconds] = useState<string>(String(startSeconds % 60).padStart(2, '0'));
  const player = useAudioPlayer(TIMER_BEEP_SOURCE);

  useEffect(() => {
    resetTimer();
  }, [startSeconds]);

  useEffect(() => {
    (async () => {
      setAudioModeAsync({
        playsInSilentMode: true,
        interruptionMode: 'duckOthers',
        interruptionModeAndroid: 'duckOthers',
      });
    })();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && finishTimestamp) {
      interval = setInterval(() => {
        updateTimer();
      }, 1000);
    } else if (!isActive) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, finishTimestamp]);

  const updateTimer = () => {
    if (!finishTimestamp) return;

    const now = Date.now();
    const secondsLeft = Math.max(Math.ceil((finishTimestamp - now) / 1000), 0);
    setTimeLeft(secondsLeft);
    setTimerBarWidth(Math.max((secondsLeft / startSeconds) * 100, MIN_BAR_WIDTH_PERCENTAGE));
    setMinutesAndSeconds(secondsLeft);

    if (secondsLeft === 0) {
      setIsActive(false);
      setFinishTimestamp(null);
      player.seekTo(0);
      player.play();
    }
  }

  const setMinutesAndSeconds = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    setMinutes(String(minutes).padStart(2, '0'));
    setSeconds(String(seconds).padStart(2, '0'));
  };

  const handleStartPause = async () => {
    if (!isActive) {
      const now = Date.now();
      const duration = timeLeft > 0 ? timeLeft : startSeconds;
      setFinishTimestamp(now + duration * 1000);
      await scheduleRestTimerNotification(duration + 1);
    } else {
      await notifee.cancelNotification(NOTIFICATION_ID);
      setFinishTimestamp(null);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setFinishTimestamp(null);
    setTimeLeft(startSeconds);
    setTimerBarWidth(100);
    setMinutes(String(Math.floor(startSeconds / 60)).padStart(2, '0'));
    setSeconds(String(startSeconds % 60).padStart(2, '0'));
  };

  const handleResetButtonPressed = () => {
    resetTimer();
  };

  const animatedBarStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${timerBarWidth}%`, { duration: 1000, easing: Easing.linear }),
      backgroundColor: withTiming(timeLeft > 5 ? '#03a1fc' : '#ef4444', { duration: 500 })
    }
  });

  return (
    <View className={`flex justify-center items-center ${className}`}>
      <View className='flex-row items-center justify-between w-full gap-4 mb-4'>
        <Pressable className='flex-row items-center justify-center active:opacity-75' onPress={onEditPressed} disabled={isActive}>
          <Text className='text-4xl text-txt-primary'>{minutes}</Text>
          <Text className='text-4xl text-txt-primary'>:</Text>
          <Text className='text-4xl text-txt-primary'>{seconds}</Text>
        </Pressable>
        <View className="flex-row gap-4">
          <GradientPressable
            style={isActive ? 'red' : 'green'}
            onPress={async () => await handleStartPause()}
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

async function scheduleRestTimerNotification(secondsUntilNotification: number) {
  // Request permissions (required for iOS)
  await notifee.requestPermission()

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'gymple_notifications',
    name: 'Gymple Notifications',
    sound: 'default',
    badge: false,
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.createTriggerNotification({
    id: NOTIFICATION_ID,
    title: "Time's up! ⏱️",
    body: 'Your rest timer has finished. Get back to your workout!',
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
      sound: 'default',
      importance: AndroidImportance.HIGH,
    },
    data: {
      type: 'rest_timer',
      message: 'Your rest timer has finished.',
    }

  }, {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + secondsUntilNotification * 1000,
  });
}
