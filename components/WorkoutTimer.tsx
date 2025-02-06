import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

interface WorkoutTimerProps {
    startSeconds: number;
}

const WorkoutTimer = ({startSeconds}: WorkoutTimerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(startSeconds);
  const [timerBarWidth, setTimerBarWidth] = useState(0);
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
        // timerBarWidth.value = withTiming(timerBarWidth.value + 10, {duration: 1000});

        setTime((prevTime) => prevTime - 1);
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

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    // timerBarWidth.value = withTiming(100, {duration: time * 1000, easing: Easing.linear});
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setTime(startSeconds);
    setIsActive(false);
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-7xl font-semibold text-gray-800 font-mono">
        {formatTime(time)}
      </Text>
      <View style={{width: `${timerBarWidth}%`}} className='h-1 bg-[#03a1fc] mb-10'/>
      <View className="flex-row w-full gap-4">
        <TouchableOpacity
          onPress={handleStartPause}
          className={`px-6 py-3 rounded-lg flex flex-1 items-center justify-center ${
            isActive ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
            {isActive ? <Ionicons name="pause" size={22} color="white" /> : <Ionicons name="play" size={22} color="white" />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReset}
          className="px-6 py-3 bg-gray-500 rounded-lg flex-1"
        >
          <Text className="text-white text-lg text-center">Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WorkoutTimer;