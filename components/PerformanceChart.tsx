import useCalculate1RepMax from "@/hooks/useCalculate1RepMax";
import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import { useEffect, useState } from "react";
import { Dimensions, View, Text, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-gifted-charts";

type ChartData = {
    value: number;
}

type ChartMetric = {
    name: string;
    chartTitle: string;
}

const windowDimensions = Dimensions.get('window');

interface PerformanceChartProps {
    performanceData: ExercisePerformanceData[]
}

export default function PerformanceChart({ performanceData }: PerformanceChartProps) {
    const metrics: ChartMetric[] = [
        {
            name: 'FSW',
            chartTitle: 'First Set Weight Over Time'
        },
        {
            name: '1RM',
            chartTitle: 'Estimated 1 Rep Max Over Time'
        }
    ]  

    const [chartData, setChartData] = useState<ChartData[]>([])
    const [selectedMetricIndex, setSelectedMetricIndex] = useState<number>(0)
    const calculate1RM = useCalculate1RepMax();

    useEffect(() => {
        setupChartData();
    }, [performanceData, selectedMetricIndex]);

    const setupChartData = () => {
        let calculatedChartData: ChartData[] = [];

        if (selectedMetricIndex === 0) {
            calculatedChartData = performanceData.map(data => {
                return {
                    value: data.sets[0].weight
                };
            });
        } else if (selectedMetricIndex === 1) {
            calculatedChartData = performanceData.map(data => {
                return {
                    value: calculate1RM(data)
                };
            });
        }

        console.log(performanceData);
        console.log(calculatedChartData);
        setChartData(calculatedChartData);
    }

    const handleMetricButtonPressed = (index: number) => {
        setSelectedMetricIndex(index);
    }

    return (
        <View className='w-[95%] flex items-center justify-center mb-12 bg-white p-4 rounded-lg shadow-lg'>
            <Text className='text-gray-800 text-xl font-semibold mb-8'>{metrics[selectedMetricIndex].chartTitle}</Text>
            <LineChart
                areaChart
                startFillColor1="#22c55e"
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
                horizontalRulesStyle={{ opacity: 0.4 }}
                rulesColor={'gray'}
                yAxisColor="gray"
                xAxisColor="gray"
                color="#22c55e"
                textColor='#ffffff'
                dataPointsColor='gray'
                dataPointsRadius={2}
                yAxisTextStyle={{ color: '#000000' }}
                noOfSections={6}
            />
            <View className="flex-row gap-2">
                <TouchableOpacity
                    className={`flex-1 rounded-lg py-1 ${selectedMetricIndex === 0 ? 'bg-[#03a1fc]' : 'bg-gray-400'}`}
                    onPress={() => handleMetricButtonPressed(0)}
                >
                    <Text className="text-white text-center font-semibold">First Set Weight</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 rounded-lg py-1 ${selectedMetricIndex === 1 ? 'bg-[#03a1fc]' : 'bg-gray-400'}`}
                    onPress={() => handleMetricButtonPressed(1)}
                >
                    <Text className="text-white text-center font-semibold">1RM</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}