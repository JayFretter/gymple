import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import theme from '../theme';
import { LineChart } from "react-native-gifted-charts";
import { DashboardTile } from '@/components/DashboardTile';
import WheelPicker from '@/components/WheelPicker';
import Modal from "react-native-modal";
import { useLocalSearchParams } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { storage } from '@/storage';
import ExercisePerformanceData from '@/interfaces/ExercisePerformanceData';

type ChartData = {
  value: number;
}

const TrackExercisePage = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);
  const [isRepsModalVisible, setIsRepsModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('Unknown Exercise');
  const [sets, setSets] = useState([{ reps: 0, weight: 0, weightUnit: 'kg' }]);
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setSelectedExercise(params.exerciseId as string);
      getExerciseData(params.exerciseId as string);
    }
  }, [isFocused]);

  const addSet = () => {
    setSets([...sets, { reps: 0, weight: 0, weightUnit: 'kg' }]);
  };

  const saveWorkout = () => {
    const workoutData: ExercisePerformanceData = {
      exerciseId: selectedExercise,
      sets: sets,
      date: new Date().getTime()
    };

    const existingDataString = storage.getString(`data_exercise_${selectedExercise}`);
    var existingData: ExercisePerformanceData[] = existingDataString ? JSON.parse(existingDataString) : [];
    existingData.push(workoutData);

    storage.set(`data_exercise_${selectedExercise}`, JSON.stringify(existingData));
    console.log('Saved data:', workoutData);

    getExerciseData(selectedExercise);
  };

  const clearData = () => {
    setSets([{ reps: 0, weight: 0, weightUnit: 'kg' }]);
  }

  const handleWeightSelected = (value: string) => {
    if (selectedSetIndex !== null) {
      const newSets = [...sets];
      newSets[selectedSetIndex].weight = parseFloat(value);
      setSets(newSets);
    }

    setIsWeightModalVisible(false);
  }

  const handleRepsSelected = (value: string) => {
    if (selectedSetIndex !== null) {
      const newSets = [...sets];
      newSets[selectedSetIndex].reps = parseInt(value);
      setSets(newSets);
    }

    setIsRepsModalVisible(false);
  }

  const getExerciseData = (exerciseId: string) => {
    const dataString = storage.getString(`data_exercise_${exerciseId}`);
    const historicData: ExercisePerformanceData[] = dataString ? JSON.parse(dataString) : [];
    console.log('Historic data:', historicData);

    const chartData: ChartData[] = historicData.map(data => {
      return {
        value: data.sets[0].weight
      };
    });

    setChartData(chartData);
  }

  return (
    <Provider theme={theme}>
      <Modal isVisible={isWeightModalVisible} hideModalContentWhileAnimating>
        <View className='flex'>
          <WheelPicker
            data={Array.from({ length: 501 }, (_, i) => String(i))}
            secondaryData={['.0', '.5']}
            rowsVisible={7}
            rowHeight={40}
            label='kg'
            onItemSelected={handleWeightSelected}
          />
          <TouchableOpacity
            className="bg-red-900 py-3 rounded-lg mt-12"
            onPress={() => {
              setIsWeightModalVisible(!isWeightModalVisible);
            }}
          >
            <Text className="text-white text-center font-semibold">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal isVisible={isRepsModalVisible} hideModalContentWhileAnimating>
        <View className='flex'>
          <WheelPicker
            data={Array.from({ length: 51 }, (_, i) => String(i))}
            rowsVisible={7}
            rowHeight={40}
            onItemSelected={handleRepsSelected}
          />
          <TouchableOpacity
            className="bg-red-900 py-3 rounded-lg mt-12"
            onPress={() => {
              setIsRepsModalVisible(!isRepsModalVisible);
            }}
          >
            <Text className="text-white text-center font-semibold">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <ScrollView className="flex-1 p-4 bg-slate-900">
        <View className="mb-6 mt-20">
          <Text className='text-gray-200 text-4xl font-bold text-center'>{selectedExercise}</Text>
        </View>
        <View className="mb-8">
          <View className="flex-row justify-between mb-3 px-2">
            <Text className="text-gray-200 font-bold w-1/3 text-center">Set</Text>
            <Text className="text-gray-200 font-bold w-1/3 text-center">Weight</Text>
            <Text className="text-gray-200 font-bold w-1/3 text-center">Reps</Text>
          </View>

          {sets.map((set, index) => (
            <View key={index} className="mb-4">
              <TouchableOpacity
                className={`flex-row justify-between items-center px-3 py-12 rounded-lg border ${selectedSetIndex === index
                  ? 'bg-slate-700 border-blue-500'
                  : 'bg-slate-700 border-slate-700'
                  }`}
                onPress={() => setSelectedSetIndex(index === selectedSetIndex ? null : index)}
              >
                <Text className="w-1/3 text-center text-gray-200">{index + 1}</Text>
                <Text className="w-1/3 text-center text-gray-200 font-bold text-lg">
                  {set.weight} kg
                </Text>
                <Text className="w-1/3 text-center text-gray-200 font-bold text-lg">
                  {set.reps}
                </Text>
              </TouchableOpacity>

              {selectedSetIndex === index && (
                <View className='flex flex-row justify-between mt-4 gap-4'>
                  <TouchableOpacity
                    className="bg-slate-500 py-3 rounded-lg flex-1"
                    onPress={() => {
                      setIsWeightModalVisible(!isWeightModalVisible);
                    }}
                  >
                    <Text className="text-white text-center font-semibold">Select Weight</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-slate-500 py-3 rounded-lg flex-1"
                    onPress={() => {
                      setIsRepsModalVisible(!isRepsModalVisible);
                    }}
                  >
                    <Text className="text-white text-center font-semibold">Select Reps</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
          <View className='flex flex-row justify-between mt-4 gap-4'>
            <TouchableOpacity
              className="border-2 border-red-500 py-3 rounded-lg flex-1"
              onPress={clearData}
            >
              <Text className="text-white text-center font-semibold">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="border-2 border-blue-500 py-3 rounded-lg flex-1"
              onPress={addSet}
            >
              <Text className="text-white text-center font-semibold">Add Set</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className="bg-green-500 py-3 rounded-lg"
          onPress={saveWorkout}
        >
          <Text className="text-white text-center font-semibold">Submit Progress</Text>
        </TouchableOpacity>

        <View className='mt-24 flex items-center'>
          <Text className='text-gray-300 text-xl font-semibold mb-8'>First Set Weight Over Time</Text>
          <View className=' w-[95%] flex items-center justify-center mb-12'>
            <View className=''>
              <LineChart
                areaChart
                startFillColor1="green"
                startOpacity={0.8}
                endOpacity={0}
                initialSpacing={0}
                data={chartData}
                hideDataPoints
                height={200}
                spacing={30}
                thickness={2}
                rulesType='solid'
                rulesColor={'gray'}
                yAxisColor="gray"
                xAxisColor="gray"
                color="green"
                textColor='#ffffff'
                dataPointsColor='gray'
                dataPointsRadius={2}
                yAxisTextStyle={{ color: '#ffffff' }}
                noOfSections={6}
              />
            </View>

          </View>
          {/* <DashboardTile mainText='23%' subText='Up from last session' /> */}
        </View>
      </ScrollView>
    </Provider>
  );
};

export default TrackExercisePage;