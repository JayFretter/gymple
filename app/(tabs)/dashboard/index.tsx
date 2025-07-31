import AchievementList from '@/components/AchievementList';
import GoalBoard from '@/components/GoalBoard';
import GradientPressable from '@/components/shared/GradientPressable';
import { useDataSeeding } from '@/hooks/useDataSeeding';
import { storage } from '@/storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

const title_image = require('@/assets/images/notepad.png');

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
      <View className='flex flex-col items-center px-4 pt-12'>
        <View className="flex-row gap-4 items-center mb-12">
          <Image
            className='self-center'
            source={title_image}
            style={{ width: 50, height: 50 }}
          />
          <View>
            <Text className='text-txt-primary text-4xl font-bold mb-1'>Gymple.</Text>
            <Text className='text-txt-secondary'>Your digital gym notepad.</Text>
          </View>
        </View>

        <GradientPressable
          className='w-full mb-4'
          style='default'
          onPress={() => router.push('/workout/WorkoutsPage')}
        >
          <View className='flex-row items-center justify-center gap-2 p-4'>
            <Text className="text-txt-primary text-center text-xl font-semibold">Work Out</Text>
            <MaterialCommunityIcons name="weight-lifter" size={18} color="white" />
          </View>
        </GradientPressable>
        <View className="flex-row gap-4 mb-4 w-full">
          <GradientPressable
            className='flex-1'
            style='gray'
            onPress={() => router.push('/dashboard/ListAchievementsPage')}
          >
            <View className='flex items-center justify-center gap-2 py-8'>
              <Text className="text-txt-primary text-center text-xl font-semibold">Achievements</Text>
              <MaterialCommunityIcons name="trophy" size={24} color="white" />
            </View>
          </GradientPressable>
          <GradientPressable
            className='flex-1'
            style='gray'
            onPress={() => router.push('/progression/ProgressionHomePage')}
          >
            <View className='flex items-center justify-center gap-2 py-8'>
              <Text className="text-txt-primary text-center text-xl font-semibold">Progress</Text>
              <MaterialCommunityIcons name="chart-line" size={24} color="white" />
            </View>
          </GradientPressable>
        </View>

        <View className="flex-row gap-4 mb-8 w-full items-center justify-between">
          <GradientPressable
            className='flex-1'
            style='gray'
            onPress={() => router.push('/dashboard/HelpPage')}
          >
            <View className='flex-row items-center justify-center gap-2 py-2'>
              <Text className="text-txt-primary text-center text-lg font-semibold">Help</Text>
              <MaterialCommunityIcons name="help-circle" size={14} color="white" />
            </View>
          </GradientPressable>
          <GradientPressable
            className='flex-1'
            style='gray'
            onPress={() => router.push('/dashboard/SettingsPage')}
          >
            <View className='flex-row items-center justify-center gap-2 py-2'>
              <Text className="text-txt-primary text-center text-lg font-semibold">Settings</Text>
              <MaterialCommunityIcons name="cog" size={14} color="white" />
            </View>
          </GradientPressable>
        </View>

        <Text className='text-txt-primary font-semibold text-2xl mb-4'>Recent Achievements</Text>
        <AchievementList className='mb-8' />
        <Text className='text-txt-primary font-semibold text-2xl'>Your Goals</Text>
        <GoalBoard />
        <TouchableOpacity
          className="mb-2 bg-gray-600 py-3 px-4 mt-[80vh] rounded-lg border-2 border-purple-400"
          onPress={debugSeedDb}
        >
          <Text className="text-white text-center font-semibold">Debug: Seed DB</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mb-2 bg-red-600 py-3 px-4 rounded-lg border-2 border-red-400"
          onPress={debugClearAllData}
        >
          <Text className="text-white text-center font-semibold">Debug: Clear all data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mb-2 bg-red-800 py-3 px-4 rounded-lg"
          onPress={debugClearAllWorkouts}
        >
          <Text className="text-white text-center font-semibold">Debug: Clear all workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mb-2 bg-red-600 py-3 px-4 rounded-lg"
          onPress={() => storage.delete('data_sessions')}
        >
          <Text className="text-white text-center font-semibold">Debug: Clear all sessions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mb-2 bg-green-500 py-3 px-4 rounded-lg"
          onPress={() => handlePress(50)}
        >
          <Text className="text-white text-center font-semibold">Expand</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mb-2 bg-red-500 py-3 px-4 rounded-lg"
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
