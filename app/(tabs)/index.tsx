import GoalBoard from '@/components/GoalBoard';
import { useDataSeeding } from '@/hooks/useDataSeeding';
import { storage } from '@/storage';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

export default function HomeScreen() {
  const myWidth = useSharedValue(100);
  const seedBaseData = useDataSeeding();


  const handlePress = (delta: number) => {
    myWidth.value = withSpring(myWidth.value + delta);
  };

  const debugSeedDb = () => {
    seedBaseData();
  }

  const debugClearAllData = () => {
    storage.clearAll();
  }

  const debugClearAllWorkouts = () => {
    storage.delete('data_workouts');
  }

  return (
    <ScrollView className='bg-gray-100'>
      <View className='flex flex-col items-center'>
        <Text className='text-gray-900 text-4xl font-bold my-12'>Gymple.</Text>
        <GoalBoard />
        <TouchableOpacity
          className="bg-gray-600 py-3 px-4 rounded-lg border-2 border-purple-400"
          onPress={debugSeedDb}
        >
          <Text className="text-white text-center font-semibold">Debug: Seed DB</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-600 py-3 px-4 rounded-lg border-2 border-red-400"
          onPress={debugClearAllData}
        >
          <Text className="text-white text-center font-semibold">Debug: Clear all data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-800 py-3 px-4 rounded-lg"
          onPress={debugClearAllWorkouts}
        >
          <Text className="text-white text-center font-semibold">Debug: Clear all workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-green-500 py-3 px-4 rounded-lg"
          onPress={() => handlePress(50)}
        >
          <Text className="text-white text-center font-semibold">Expand</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-500 py-3 px-4 rounded-lg"
          onPress={() => handlePress(-50)}
        >
          <Text className="text-white text-center font-semibold">Contract</Text>
        </TouchableOpacity>
        <Animated.View className='bg-violet-400 h-24'
          style={{
            width: myWidth,
          }}
        />
      </View>
    </ScrollView>
  );
}
