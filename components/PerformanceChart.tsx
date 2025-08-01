import { WeightUnit } from "@/enums/weight-unit";
import useCalculate1RepMax from "@/hooks/useCalculate1RepMax";
import useCalculateVolume from "@/hooks/useCalculateVolume";
import { useConvertWeightUnit } from "@/hooks/useConvertWeightUnit";
import useUserPreferences from "@/hooks/useUserPreferences";
import { useWeightString } from "@/hooks/useWeightString";
import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import { roundHalf } from "@/utils/maths-utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
import { Dimensions, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { BarChart, CurveType, LineChart } from "react-native-gifted-charts";

type ChartData = {
  value: number;
  // labelComponent: () => React.JSX.Element | null;
}

type ChartMetric = {
  name: string;
  chartTitle: string;
}

const windowDimensions = Dimensions.get('window');

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
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(WeightUnit.KG);
  const [isBarChart, setIsBarChart] = useState<boolean>(false);
  const { convertToUnit } = useConvertWeightUnit();

  useEffect(() => {
    const userPreferences = getUserPreferences();
    setWeightUnit(userPreferences.weightUnit);
  }, []);

  useEffect(() => {
    setupChartData();
  }, [performanceData, selectedMetricIndex, weightUnit, isBarChart]);

  const setupChartData = () => {
    let calculatedChartData: ChartData[] = [];

    const initialChartData: ChartData = {
      // labelComponent: () => isBarChart ? <Text className="text-txt-secondary">0</Text> : null,
      value: 0
    };

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
            return set.weightUnit === WeightUnit.KG ?
              convertToUnit(weight, WeightUnit.LBS) :
              convertToUnit(weight, WeightUnit.KG);
          }));
        }

        return {
          value: roundHalf(heaviestWeight)
        };
      });
    } else if (selectedMetricIndex === 1) {
      calculatedChartData = performanceData.map(data => {
        const calculatedValue = calculate1RM(data, weightUnit);
        return {
          value: roundHalf(calculatedValue)
        };
      });
    } else if (selectedMetricIndex === 2) {
      calculatedChartData = performanceData.map(data => {
        const calculatedValue = calculateVolume(data.sets, weightUnit);
        return {
          value: roundHalf(calculatedValue)
        };
      });
    }
    setChartData(calculatedChartData);
  }

  const handleMetricButtonPressed = (index: number) => {
    setSelectedMetricIndex(index);
  }

  const switchWeightUnit = () => {
    const newUnit = weightUnit === WeightUnit.KG ? WeightUnit.LBS : WeightUnit.KG;
    setWeightUnit(newUnit);
  }

  const renderChart = () => {
    if (isBarChart) {
      return (
        <BarChart
          scrollToEnd
          initialSpacing={0}
          data={chartData}
          height={180}
          width={windowDimensions.width - 120}
          spacing={5}
          barBorderRadius={6}
          rulesType='solid'
          horizontalRulesStyle={{ opacity: 0.2 }}
          rulesColor={'gray'}
          yAxisColor="gray"
          xAxisColor="gray"
          frontColor="#068bec"
          yAxisTextStyle={{ color: '#aaaaaa' }}
          noOfSections={8}
          rotateLabel
          xAxisLabelTexts={chartData.map(d => d.value.toString())}
          xAxisLabelTextStyle={{ color: '#aaaaaa', textAlign: 'left', fontSize: 12 }}
          xAxisLabelsVerticalShift={10}
        />
      );
    }

    return (
      <LineChart
        areaChart
        isAnimated
        animationDuration={400}
        startFillColor1="#068bec"
        scrollToEnd
        startOpacity={0.8}
        endOpacity={0}
        initialSpacing={0}
        data={chartData}
        height={180}
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
        textColor='#aaaaaa'
        yAxisTextStyle={{ color: '#aaaaaa' }}
        noOfSections={6}
        dataPointsRadius={4}
        dataPointsColor="#068bec"
        dataPointsShape="circle"
        showValuesAsDataPointsText
        textShiftX={4}
        textShiftY={-4}
      />
    )
  }

  const renderNoDataText = () => {
    return (
      <Text className="text-txt-secondary mb-10">No data yet.</Text>
    );
  }

  return (
    <View className={className + ' w-full flex items-center justify-center bg-card p-4 rounded-lg shadow-lg'}>
      <ScrollView className="mb-4" horizontal showsHorizontalScrollIndicator={false}>
        {metrics.map((metric, index) => (
          <TouchableOpacity
            key={index}
            className={`px-4 py-2 rounded-lg mx-2 ${selectedMetricIndex === index ? 'bg-[#2a53b5]' : 'bg-primary'}`}
            onPress={() => handleMetricButtonPressed(index)}
          >
            <Text className="text-white font-semibold">{metric.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="flex-row items-center mb-8">
        <TouchableOpacity
          className={`px-3 py-1 rounded-l-lg ${isBarChart ? 'bg-primary' : 'bg-[#2a53b5]'}`}
          onPress={() => setIsBarChart(false)}
        >
          <Text className={`text-white font-semibold`}>Line</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-3 py-1 rounded-r-lg ${isBarChart ? 'bg-[#2a53b5]' : 'bg-primary'}`}
          onPress={() => setIsBarChart(true)}
        >
          <Text className={`text-white font-semibold`}>Bar</Text>
        </TouchableOpacity>
      </View>

      <Text className='text-txt-secondary text-lg font-semibold mb-2'>{metrics[selectedMetricIndex].chartTitle} ({weightUnit})</Text>
      {chartData.length > 0 && (
        <Text className="text-xs text-txt-secondary mb-1">
          Previous: {chartData[chartData.length - 1].value} {weightUnit}
        </Text>
      )}
      {chartData.length === 0 ? renderNoDataText() : renderChart()}

      <TouchableOpacity
        className="flex-row items-center justify-center mt-12"
        onPress={switchWeightUnit}
      >
        <AntDesign name="swap" size={14} color="white" />
        <Text className="text-txt-secondary text-center">kg/lbs</Text>
      </TouchableOpacity>

    </View>
  )
}