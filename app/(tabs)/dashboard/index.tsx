import AchievementList from '@/components/AchievementList';
import DashboardTile from '@/components/DashboardTile';
import GoalBoard from '@/components/GoalBoard';
import GradientPressable from '@/components/shared/GradientPressable';
import WorkoutStreakChart from '@/components/shared/WorkoutStreakChart';
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
        <View className="flex-row gap-2 items-center">
          <Image
            className='self-center'
            source={title_image}
            style={{ width: 50, height: 50 }}
          />
          <View>
            <Text className='text-txt-primary text-4xl font-bold mb-1'>Gymple.</Text>
            <Text className='text-txt-secondary'>The digital gym notepad.</Text>
          </View>
        </View>

        <WorkoutStreakChart className='mt-8' />
      
        <View className="flex-row flex-wrap items-center gap-4 mt-8">
          <DashboardTile metric='workoutCount' title='Total Workouts Logged' />
        </View>

        <GradientPressable
          className='w-full mb-4 mt-8'
          style='gray'
          onPress={() => router.push('/workout/WorkoutsPage')}
        >
          <View className='flex-row items-center justify-center gap-2 p-4'>
            <Text className="text-txt-primary text-center text-xl font-semibold">Go to Workouts</Text>
          </View>
        </GradientPressable>
        <View className="flex-row gap-4 mb-4 w-full">
          <GradientPressable
            className='flex-1'
            style='gray'
            onPress={() => router.push('/dashboard/ListAchievementsPage')}
          >
            <View className='flex items-center justify-center gap-2 py-2'>
              <MaterialCommunityIcons name="trophy" size={94} color="#333333" />
              <Text className="text-txt-primary text-center text-xl font-semibold absolute">Achievements</Text>
            </View>
          </GradientPressable>
          <GradientPressable
            className='flex-1'
            style='gray'
            onPress={() => router.push('/progression/ProgressionHomePage')}
          >
            <View className='flex items-center justify-center gap-2 py-2'>
              <MaterialCommunityIcons name="chart-line" size={94} color="#333333" />
              <Text className="text-txt-primary text-center text-xl font-semibold absolute">Progress</Text>
            </View>
          </GradientPressable>
        </View>

        <View className="flex-row gap-4 w-full items-center justify-between">
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

        <Text className='text-txt-primary font-semibold text-2xl mt-12 mb-4'>Recent Achievements</Text>
        <AchievementList />
        <Text className='text-txt-primary font-semibold text-2xl mt-8'>Your Goals</Text>
        <GoalBoard className='mt-4' />
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
