import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

export default function HomeScreen() {
  const myWidth = useSharedValue(100);

  const handlePress = (delta: number) => {
    myWidth.value = withSpring(myWidth.value + delta);
  };

  return (
    <View className='flex-1 justify-center items-center gap-12'>
      <Text className='text-gray-300 text-2xl'>Gymple.</Text>
      <TouchableOpacity
        className="bg-green-500 py-3 px-4 rounded-lg"
        onPress={() => handlePress(50)}
      >
        <Text className="text-white text-center font-semibold">Press me :)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-500 py-3 px-4 rounded-lg"
        onPress={() => handlePress(-50)}
      >
        <Text className="text-white text-center font-semibold">Press me :)</Text>
      </TouchableOpacity>
      <Animated.View className='bg-violet-400 h-24'
        style={{
          width: myWidth,
        }}
      />
    </View>
  );
}
