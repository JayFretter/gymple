import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
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
  //   const timerBarWidth = useSharedValue(0);

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
      setTime((parseInt(minutes)*60) + parseInt(seconds));
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
      {/* <Text className="text-6xl font-semibold text-txt-secondary font-mono mb-4">
        {formatTime(time)}
      </Text> */}
      <View className='flex-row items-center justify-center mb-4'>
        <TextInput className='text-6xl font-semibold text-txt-secondary font-mono bg-card py-4 px-2 rounded-xl' maxLength={2} keyboardType='numeric' value={minutes} onChangeText={setMinutes} />
        <Text className='text-6xl font-semibold text-txt-secondary font-mono'>:</Text>
        <TextInput className='text-6xl font-semibold text-txt-secondary font-mono bg-card py-4 px-2 rounded-xl' maxLength={2} keyboardType='numeric' value={seconds} onChangeText={setSeconds} />
      </View>
      <View style={{ width: `${timerBarWidth}%` }} className='h-1 bg-[#03a1fc] mb-8 rounded-xl' />
      <View className="flex-row w-full gap-4">
        <TouchableOpacity
          onPress={handleStartPause}
          className={`px-6 py-3 rounded-lg flex flex-1 items-center justify-center ${isActive ? 'bg-red-500' : 'bg-green-500'
            }`}
        >
          {isActive ? <Ionicons name="pause" size={20} color="white" /> : <Ionicons name="play" size={20} color="white" />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReset}
          className="px-6 py-3 bg-gray-500 rounded-lg flex-1"
        >
          <Text className="text-white text-center">Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RestTimer;