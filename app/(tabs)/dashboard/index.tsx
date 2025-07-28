import AchievementList from '@/components/AchievementList';
import GoalBoard from '@/components/GoalBoard';
import GradientPressable from '@/components/shared/GradientPressable';
import { useDataSeeding } from '@/hooks/useDataSeeding';
import { storage } from '@/storage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router } from 'expo-router';
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
    <ScrollView className='bg-primary' showsVerticalScrollIndicator={false}>
      <View className='flex flex-col items-center px-4'>
        <GradientPressable
          style='gray'
          className="bg-card mt-4 self-end"
          onPress={() => router.push('/(tabs)/dashboard/SettingsPage')}
        >
          <View className='flex-row items-center gap-2 py-1 px-2'>
            <FontAwesome5 name="cog" size={12} color='white' />
            <Text className="text-txt-primary text-center font-semibold">Settings</Text>
          </View>
        </GradientPressable>
        <Text className='text-txt-primary text-4xl font-bold mt-4'>Gymple.</Text>
        <Text className='text-txt-secondary mb-12'>Gym tracking made fun and easy.</Text>
        <GradientPressable
          className='w-full mb-8'
          style='default'
          onPress={() => router.push('/workout/WorkoutsPage')}
        >
          <Text className="text-txt-primary text-center text-xl font-semibold my-2">Workout</Text>
        </GradientPressable>
        <Text className='text-txt-primary font-semibold text-2xl self-start mb-4'>Your Achievements</Text>
        <AchievementList className='mb-8 w-full' />
        <Text className='text-txt-primary font-semibold text-2xl self-start'>Your Goals</Text>
        <GoalBoard />
        <TouchableOpacity
          className="bg-gray-600 py-3 px-4 mt-[80vh] rounded-lg border-2 border-purple-400"
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
