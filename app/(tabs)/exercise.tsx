import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import theme from '../theme';
import { LineChart } from "react-native-gifted-charts";
import { DashboardTile } from '@/components/DashboardTile';

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
  const [selectedExercise, setSelectedExercise] = useState('Select Exercise');
  const [sets, setSets] = useState([{ reps: 0, weight: '' }]);
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);

  const addSet = () => {
    setSets([...sets, { reps: 0, weight: '' }]);
  };

  const handleWeightChange = (index: number, value: string) => {
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
    setSets([{ reps: 0, weight: '' }]);
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
                <TextInput
                  className="w-1/3 border border-gray-300 rounded px-2 py-1 text-center bg-slate-600 text-gray-200"
                  placeholderTextColor="#eee"
                  keyboardType="numeric"
                  value={set.weight}
                  onChangeText={(text) => handleWeightChange(index, text)}
                  placeholder="0.0"
                />
                <Text className="w-1/3 text-center text-gray-200 font-bold text-lg">
                  {set.reps}
                </Text>
              </TouchableOpacity>

              {selectedSetIndex === index && (
                <View className="flex-row justify-between mt-2 mb-4 px-2">
                  <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded-lg w-1/5 items-center"
                    onPress={() => adjustReps(-5)}
                  >
                    <Text className="text-white font-bold">-5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded-lg w-1/5 items-center"
                    onPress={() => adjustReps(-1)}
                  >
                    <Text className="text-white font-bold">-1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded-lg w-1/5 items-center"
                    onPress={() => adjustReps(1)}
                  >
                    <Text className="text-white font-bold">+1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded-lg w-1/5 items-center"
                    onPress={() => adjustReps(5)}
                  >
                    <Text className="text-white font-bold">+5</Text>
                  </TouchableOpacity>
                </View>
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