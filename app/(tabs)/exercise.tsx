import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import theme from '../theme';
import { LineChart } from "react-native-gifted-charts";
import { DashboardTile } from '@/components/DashboardTile';
import WheelPicker from '@/components/WheelPicker';
import Modal from "react-native-modal";

const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }, { value: 80 }]

const exercises = [
  'Bench Press',
  'Squat',
  'Deadlift',
  'Overhead Press',
  'Barbell Row',
  'Pull Ups',
  'Dumbbell Curl',
  'Leg Press'
];

const WorkoutTracker = () => {
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('Select Exercise');
  const [sets, setSets] = useState([{ reps: 0, weight: 0 }]);
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);

  const addSet = () => {
    setSets([...sets, { reps: 0, weight: 0 }]);
  };

  const handleWeightChange = (index: number, value: number) => {
    const newSets = [...sets];
    newSets[index].weight = value;
    setSets(newSets);
  };

  const adjustReps = (delta: number) => {
    if (selectedSetIndex === null) return;
    const newSets = [...sets];
    const newReps = Math.max(newSets[selectedSetIndex].reps + delta, 0);
    newSets[selectedSetIndex].reps = newReps;
    setSets(newSets);
  };

  const saveWorkout = () => {
    const workoutData = {
      exercise: selectedExercise,
      sets: sets
    };
    console.log('Saved data:', workoutData);
  };

  const clearData = () => {
    setSets([{ reps: 0, weight: 0 }]);
  }

  const handleWeightSelected = (value: string) => {
    if (selectedSetIndex !== null) {
      handleWeightChange(selectedSetIndex, parseFloat(value));
    }

    setIsModalVisible(false);
  }

  return (
    <Provider theme={theme}>
      <ScrollView className="flex-1 p-4 bg-slate-900">
        <View className="mb-6 mt-20">
          <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={
              <TouchableOpacity
                className="bg-blue-500 px-4 py-3 rounded-lg"
                onPress={() => setVisible(true)}
              >
                <Text className="text-white text-center font-semibold">
                  {selectedExercise}
                </Text>
              </TouchableOpacity>
            }>
            {exercises.map((exercise, index) => (
              <Menu.Item
                key={index}
                onPress={() => {
                  setSelectedExercise(exercise);
                  setVisible(false);
                }}
                title={exercise}
              />
            ))}
          </Menu>
        </View>

        <View className="mb-8">
          <View className="flex-row justify-between mb-3 px-2">
            <Text className="text-gray-200 font-bold w-1/3 text-center">Set</Text>
            <Text className="text-gray-200 font-bold w-1/3 text-center">Weight (kg)</Text>
            <Text className="text-gray-200 font-bold w-1/3 text-center">Reps</Text>
          </View>

          {sets.map((set, index) => (
            <View key={index} className="mb-2">
              <TouchableOpacity
                className={`flex-row justify-between items-center p-3 rounded-lg border ${selectedSetIndex === index
                  ? 'bg-slate-700 border-blue-500'
                  : 'bg-slate-700 border-slate-700'
                  }`}
                onPress={() => setSelectedSetIndex(index === selectedSetIndex ? null : index)}
              >
                <Text className="w-1/3 text-center text-gray-200">{index + 1}</Text>
                <Text className="w-1/3 text-center text-gray-200 font-bold text-lg">
                  {set.weight}
                </Text>
                <Text className="w-1/3 text-center text-gray-200 font-bold text-lg">
                  {set.reps}
                </Text>
              </TouchableOpacity>

              {selectedSetIndex === index && (
                <TouchableOpacity
                  className="bg-slate-500 py-3 rounded-lg mt-2"
                  onPress={() => {
                    setIsModalVisible(!isModalVisible);
                  }}
                >
                  <Text className="text-white text-center font-semibold">Select Weight</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity
            className="mb-4 border-2 border-blue-500 py-3 rounded-lg mt-4"
            onPress={addSet}
          >
            <Text className="text-white text-center font-semibold">Add Set</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border-2 border-red-500 py-3 rounded-lg"
            onPress={clearData}
          >
            <Text className="text-white text-center font-semibold">Reset</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-green-500 py-3 rounded-lg"
          onPress={saveWorkout}
        >
          <Text className="text-white text-center font-semibold">Submit Progress</Text>
        </TouchableOpacity>

        <Modal isVisible={isModalVisible} hideModalContentWhileAnimating>
          <View className='flex'>
            <WheelPicker
              data={Array.from({ length: 100 }, (_, i) => String(i * 0.5))}
              rowsVisible={5}
              rowHeight={40}
              label='kg'
              onItemSelected={handleWeightSelected}
            />
            <TouchableOpacity
              className="bg-red-900 py-3 rounded-lg mt-12"
              onPress={() => {
                setIsModalVisible(!isModalVisible);
              }}
            >
              <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <View className='py-12 flex items-center gap-12'>
          <DashboardTile mainText='23%' subText='Up from last session' />
          <View className='bg-slate-700 w-64 h-64 flex items-center justify-center rounded-[20%]'>
            <View className=''>
              <LineChart
                areaChart
                startFillColor1="#0BA5A4"
                hideYAxisText
                startOpacity={0.8}
                endOpacity={0}
                initialSpacing={0}
                data={data}
                height={100}
                spacing={30}
                thickness={5}
                hideRules
                yAxisColor="#0BA5A4"
                showVerticalLines
                verticalLinesColor="rgba(14,164,164,0.5)"
                xAxisColor="#0BA5A4"
                color="#0BA5A4"
                textColor='#ffffff'
                dataPointsColor='#ffffff'
              />
            </View>

          </View>
        </View>
      </ScrollView>
    </Provider>
  );
};

export default WorkoutTracker;