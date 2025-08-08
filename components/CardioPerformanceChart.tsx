import { WeightUnit } from "@/enums/weight-unit";
import useCalculate1RepMax from "@/hooks/useCalculate1RepMax";
import useCalculateVolume from "@/hooks/useCalculateVolume";
import { useConvertWeightUnit } from "@/hooks/useConvertWeightUnit";
import useUserPreferences from "@/hooks/useUserPreferences";
import { useWeightString } from "@/hooks/useWeightString";
import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import { roundHalf } from "@/utils/maths-utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Dimensions, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { BarChart, CurveType, LineChart } from "react-native-gifted-charts";
import NoDataYetChart from "./shared/NoDataYetChart";
import { DistanceUnit } from "@/enums/distance-unit";
import { useConvertDistanceUnit } from "@/hooks/useConvertDistanceUnit";

type ChartData = {
  value: number;
  // labelComponent: () => React.JSX.Element | null;
}

type ChartMetric = {
  name: string;
  chartTitle: string;
}

const windowDimensions = Dimensions.get('window');

interface CardioPerformanceChartProps {
  className?: string;
  performanceData: ExercisePerformanceData[]
}

export default function CardioPerformanceChart({ className, performanceData }: CardioPerformanceChartProps) {
  const metrics: ChartMetric[] = [
    {
      name: 'Furthest Distance',
      chartTitle: 'Furthest Distance Over Time'
    },
    {
      name: 'Session Distance',
      chartTitle: 'Session Distance Over Time'
    }
  ]

  const [chartData, setChartData] = useState<ChartData[]>([])
  const [selectedMetricIndex, setSelectedMetricIndex] = useState<number>(0)
  const calculate1RM = useCalculate1RepMax();
  const calculateVolume = useCalculateVolume();
  const [getUserPreferences] = useUserPreferences();
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(DistanceUnit.KM);
  const [isBarChart, setIsBarChart] = useState<boolean>(false);
  const { convertToDistanceUnit } = useConvertDistanceUnit();
  const isFocused = useIsFocused();

  useEffect(() => {
    const userPreferences = getUserPreferences();
    setDistanceUnit(userPreferences.distanceUnit);
  }, [isFocused]);

  useEffect(() => {
    setupChartData();
  }, [performanceData, selectedMetricIndex, distanceUnit, isBarChart]);

  const setupChartData = () => {
    let calculatedChartData: ChartData[] = [];

    const initialChartData: ChartData = {
      // labelComponent: () => isBarChart ? <Text className="text-txt-secondary">0</Text> : null,
      value: 0
    };

    if (selectedMetricIndex === 0) {
      calculatedChartData = performanceData.map(data => {
        let furthestDistance = 0;
        if (data.sets?.every(set => set.type === 'distance') && data.sets.length > 0) {
          furthestDistance = Math.max(...data.sets.map(set => {
            const weight = set.distance;
            if (set.distanceUnit === distanceUnit) {
              return weight;
            }
            return set.distanceUnit === DistanceUnit.KM ?
              convertToDistanceUnit(weight, DistanceUnit.MI) :
              convertToDistanceUnit(weight, DistanceUnit.KM);
          }));
        }

        return {
          value: roundHalf(furthestDistance)
        };
      });
    } else if (selectedMetricIndex === 1) {
      calculatedChartData = performanceData.map(data => {
        let totalDistance = 0;
        if (data.sets?.every(set => set.type === 'distance') && data.sets.length > 0) {
          totalDistance = data.sets.reduce((acc, set) => {
            const weight = set.distance;
            if (set.distanceUnit === distanceUnit) {
              return acc + weight;
            }
            return acc + (set.distanceUnit === DistanceUnit.KM ?
              convertToDistanceUnit(weight, DistanceUnit.MI) :
              convertToDistanceUnit(weight, DistanceUnit.KM));
          }, 0);
        }

        return {
          value: roundHalf(totalDistance)
        };
      });
    }
    setChartData(calculatedChartData);
  }

  const handleMetricButtonPressed = (index: number) => {
    setSelectedMetricIndex(index);
  }

  const switchDistanceUnit = () => {
    const newUnit = distanceUnit === DistanceUnit.KM ? DistanceUnit.MI : DistanceUnit.KM;
    setDistanceUnit(newUnit);
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
        overflowTop={1}
        areaChart
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
        hideRules
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
      <NoDataYetChart width={windowDimensions.width - 120} height={180} />
    );
  }

  return (
    <View className={className + ' w-full flex items-center justify-center bg-card p-4 rounded-lg'}>
      <ScrollView className="mb-4" horizontal showsHorizontalScrollIndicator={false}>
        {metrics.map((metric, index) => (
          <TouchableOpacity
            key={index}
            className={`px-4 py-2 rounded-lg mx-2 ${selectedMetricIndex === index ? 'bg-highlight' : 'bg-primary'}`}
            onPress={() => handleMetricButtonPressed(index)}
          >
            <Text className={`${selectedMetricIndex === index ? 'text-white' : 'text-txt-primary'} font-semibold`}>{metric.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="flex-row items-center mb-8">
        <TouchableOpacity
          className={`px-3 py-1 rounded-l-lg ${isBarChart ? 'bg-primary' : 'bg-highlight'}`}
          onPress={() => setIsBarChart(false)}
        >
          <Text className={`${!isBarChart ? 'text-white' : 'text-txt-primary'} font-semibold`}>Line</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-3 py-1 rounded-r-lg ${isBarChart ? 'bg-[#2a53b5]' : 'bg-primary'}`}
          onPress={() => setIsBarChart(true)}
        >
          <Text className={`${isBarChart ? 'text-white' : 'text-txt-primary'} font-semibold`}>Bar</Text>
        </TouchableOpacity>
      </View>

      <Text className='text-txt-secondary text-lg font-semibold mb-2'>{metrics[selectedMetricIndex].chartTitle} ({distanceUnit})</Text>
      {chartData.length > 0 && (
        <Text className="text-xs text-txt-secondary mb-1">
          Previous: {chartData[chartData.length - 1].value} {distanceUnit}
        </Text>
      )}
      {chartData.length === 0 ? renderNoDataText() : renderChart()}

      <TouchableOpacity
        className="flex-row items-center justify-center mt-12"
        onPress={switchDistanceUnit}
      >
        <AntDesign name="swap" size={14} color="white" />
        <Text className="text-txt-secondary text-center">kg/lbs</Text>
      </TouchableOpacity>

    </View>
  )
}