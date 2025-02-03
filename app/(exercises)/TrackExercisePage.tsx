import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Pressable } from 'react-native';
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
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import useFetchAllExercises from '@/hooks/useFetchAllExercises';

type ChartData = {
  value: number;
}

const TrackExercisePage = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);
  const [isRepsModalVisible, setIsRepsModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDefinition | null>(null);
  const [sets, setSets] = useState([{ reps: 0, weight: 0, weightUnit: 'kg' }]);
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getExerciseDefinition(params.exerciseId as string);
      getExerciseData(params.exerciseId as string);
    }
  }, [isFocused]);

  const getExerciseDefinition = (exerciseId: string) => {
    const allExercises = useFetchAllExercises();
    const exercise = allExercises.find(e => e.id === exerciseId);

    if (!exercise)
      return;

    setSelectedExercise(exercise);
  }

  const addSet = () => {
    setSets([...sets, { reps: 0, weight: 0, weightUnit: 'kg' }]);
  };

  const saveWorkout = () => {
    if (!selectedExercise)
      return;

    const workoutData: ExercisePerformanceData = {
      exerciseId: selectedExercise.id,
      sets: sets,
      date: new Date().getTime()
    };

    const existingDataString = storage.getString(`data_exercise_${selectedExercise.id}`);
    var existingData: ExercisePerformanceData[] = existingDataString ? JSON.parse(existingDataString) : [];
    existingData.push(workoutData);

    storage.set(`data_exercise_${selectedExercise.id}`, JSON.stringify(existingData));
    console.log('Saved data:', workoutData);

    getExerciseData(selectedExercise.id);
  };

  const clearData = () => {
    setSets([{ reps: 0, weight: 0, weightUnit: 'kg' }]);
  }

  const openWeightModal = (setNumber: number) => {
    setSelectedSetIndex(setNumber);
    setIsWeightModalVisible(true)
  }

  const openRepsModal = (setNumber: number) => {
    setSelectedSetIndex(setNumber);
    setIsRepsModalVisible(true)
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
      <ScrollView className="flex-1 pt-12 px-4 bg-slate-900">
        <View className="mb-24">
          <Text className='text-gray-200 text-4xl font-bold text-center'>{selectedExercise?.name}</Text>
        </View>
        <View className="mb-8">
          {sets.map((set, index) => (
            <View key={index} className="mb-4">
              <TouchableOpacity
                className={`flex-row justify-between items-center px-3 py-8 rounded-lg border ${selectedSetIndex === index
                  ? 'bg-slate-700 border-blue-500'
                  : 'bg-slate-700 border-slate-700'
                  }`}
                onPress={() => setSelectedSetIndex(index === selectedSetIndex ? null : index)}
              >
                <Text className="w-1/4 text-center text-gray-200 font-bold text-xl">Set {index + 1}</Text>
                <TouchableOpacity className="bg-slate-800 w-1/3 py-3 mx-4 rounded-lg flex-1" onPress={() => openWeightModal(index)}>
                  <Text className="text-center text-gray-200 font-bold text-lg">{set.weight} kg</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-slate-800 w-1/3 py-3 mx-4 rounded-lg flex-1" onPress={() => openRepsModal(index)}>
                  <Text className="text-center text-gray-200 font-bold text-lg">{set.reps} reps</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          ))}
          <View className='flex flex-row justify-between mt-1 mx-2 gap-12'>
            <TouchableOpacity
              className="flex-1"
              onPress={clearData}
            >
              <Text className="text-red-400 text-left font-semibold">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1"
              onPress={addSet}
            >
              <Text className="text-blue-200 text-right font-semibold">+ Add Set</Text>
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