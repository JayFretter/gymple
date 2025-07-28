import useCalculate1RepMax from "@/hooks/useCalculate1RepMax";
import useCalculateVolume from "@/hooks/useCalculateVolume";
import useUserPreferences from "@/hooks/useUserPreferences";
import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
import { Dimensions, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";

type ChartData = {
  value: number;
}

type ChartMetric = {
  name: string;
  chartTitle: string;
}

const windowDimensions = Dimensions.get('window');
const kgToLbs: number = 2.20462;

interface PerformanceChartProps {
  className?: string;
  performanceData: ExercisePerformanceData[]
}

export default function PerformanceChart({ className, performanceData }: PerformanceChartProps) {
  const metrics: ChartMetric[] = [
    {
      name: 'Heaviest Weight',
      chartTitle: 'Heaviest Set Weight Over Time'
    },
    {
      name: 'Estimated 1RM',
      chartTitle: 'Estimated 1 Rep Max Over Time'
    },
    {
      name: 'Volume',
      chartTitle: 'Exercise Volume Over Time'
    }
  ]

  const [chartData, setChartData] = useState<ChartData[]>([])
  const [selectedMetricIndex, setSelectedMetricIndex] = useState<number>(0)
  const calculate1RM = useCalculate1RepMax();
  const calculateVolume = useCalculateVolume();
  const [getUserPreferences] = useUserPreferences();
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');

  useEffect(() => {
    const userPreferences = getUserPreferences();
    setWeightUnit(userPreferences.weightUnit);
  }, []);

  useEffect(() => {
    setupChartData();
  }, [performanceData, selectedMetricIndex, weightUnit]);

  const setupChartData = () => {
    let calculatedChartData: ChartData[] = [];

    if (selectedMetricIndex === 0) {
      calculatedChartData = performanceData.map(data => {
        let heaviestWeight = 0;
        if (data.sets && data.sets.length > 0) {
          // Convert weights to the selected unit
          heaviestWeight = Math.max(...data.sets.map(set => {
            const weight = set.weight;
            if (set.weightUnit === weightUnit) {
              return weight;
            }
            return set.weightUnit === 'kg' ? weight * kgToLbs : weight / kgToLbs;
          }));
        }

        return {
          labelComponent: () => <Text className="text-white -rotate-90 bottom-12">{heaviestWeight}</Text>,
          value: heaviestWeight
        };
      });
    } else if (selectedMetricIndex === 1) {
      calculatedChartData = performanceData.map(data => {
        const calculatedValue = calculate1RM(data, weightUnit);
        return {
          labelComponent: () => <Text className="text-white -rotate-90 bottom-12">{calculatedValue}</Text>,
          value: calculatedValue
        };
      });
    } else if (selectedMetricIndex === 2) {
      calculatedChartData = performanceData.map(data => {
        const calculatedValue = calculateVolume(data.sets, weightUnit);
        return {
          labelComponent: () => <Text className="text-white -rotate-90 bottom-12">{calculatedValue}</Text>,
          value: calculatedValue
        };
      });
    }

    setChartData(calculatedChartData);
  }

  const handleMetricButtonPressed = (index: number) => {
    setSelectedMetricIndex(index);
  }

  const switchWeightUnit = () => {
    const newUnit = weightUnit === 'kg' ? 'lbs' : 'kg';
    setWeightUnit(newUnit);
  }

  const renderChart = () => {
    return (
      <BarChart
        scrollToEnd
        initialSpacing={0}
        data={chartData}
        height={200}
        width={windowDimensions.width - 120}
        spacing={5}
        barBorderRadius={6}
        rulesType='solid'
        horizontalRulesStyle={{ opacity: 0.2 }}
        rulesColor={'gray'}
        yAxisColor="gray"
        xAxisColor="gray"
        frontColor="#068bec"
        yAxisTextStyle={{ color: '#FFFFFF' }}
        noOfSections={8}
      />
    );
  }

  const renderNoDataText = () => {
    return (
      <Text className="text-txt-secondary mb-10">No data yet.</Text>
    );
  }

  return (
    <View className={className + ' w-full flex items-center justify-center bg-card p-4 rounded-lg shadow-lg'}>
      <ScrollView className="mb-8" horizontal showsHorizontalScrollIndicator={false}>
        {metrics.map((metric, index) => (
          <TouchableOpacity
            key={index}
            className={`px-4 py-2 rounded-lg mx-2 ${selectedMetricIndex === index ? 'bg-[#068bec]' : 'bg-primary'}`}
            onPress={() => handleMetricButtonPressed(index)}
          >
            <Text className="text-white font-semibold">{metric.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text className='text-txt-primary text-xl font-semibold mb-8'>{metrics[selectedMetricIndex].chartTitle} ({weightUnit})</Text>
      {chartData.length === 0 ? renderNoDataText() : renderChart()}
      {/* <LineChart
                areaChart
                startFillColor1="#068bec"
                scrollToEnd
                startOpacity={0.8}
                endOpacity={0}
                initialSpacing={0}
                data={chartData}
                hideDataPoints
                height={200}
                width={windowDimensions.width - 120}
                adjustToWidth
                spacing={30}
                thickness={2}
                rulesType='solid'
                horizontalRulesStyle={{ opacity: 0.2 }}
                rulesColor={'gray'}
                yAxisColor="gray"
                xAxisColor="gray"
                color="#068bec"
                textColor='#ffffff'
                dataPointsColor='gray'
                dataPointsRadius={2}
                yAxisTextStyle={{ color: '#ffffff' }}
                noOfSections={6}
            /> */}
      <TouchableOpacity
        className="flex-row items-center justify-center"
        onPress={switchWeightUnit}
      >
        <AntDesign name="swap" size={14} color="white" />
        <Text className="text-txt-secondary text-center">kg/lbs</Text>
      </TouchableOpacity>

    </View>
  )
}