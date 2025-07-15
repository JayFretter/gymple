import useCalculate1RepMax from "@/hooks/useCalculate1RepMax";
import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import { useEffect, useState } from "react";
import { Dimensions, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { BarChart } from "react-native-gifted-charts";

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
            name: 'Heaviest Weight',
            chartTitle: 'Heaviest Set Weight Over Time (kg)'
        },
        {
            name: '1RM',
            chartTitle: 'Estimated 1 Rep Max Over Time (kg)'
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
                let heaviestWeight = 0;
                if (data.sets && data.sets.length > 0) {
                    heaviestWeight = Math.max(...data.sets.map(set => set.weight));
                }
                return {
                    value: heaviestWeight
                };
            });
        } else if (selectedMetricIndex === 1) {
            calculatedChartData = performanceData.map(data => {
                return {
                    value: calculate1RM(data)
                };
            });
        }

        setChartData(calculatedChartData);
    }

    const handleMetricButtonPressed = (index: number) => {
        setSelectedMetricIndex(index);
    }

    return (
        <View className='w-[95%] flex items-center justify-center mb-12 bg-white p-4 rounded-lg shadow-lg'>
            <ScrollView className="mb-8" horizontal showsHorizontalScrollIndicator={false}>
                {metrics.map((metric, index) => (
                    <TouchableOpacity
                        key={index}
                        className={`px-4 py-2 rounded-lg mx-2 ${selectedMetricIndex === index ? 'bg-[#03a1fc]' : 'bg-gray-400'}`}
                        onPress={() => handleMetricButtonPressed(index)}
                    >
                        <Text className="text-white font-semibold">{metric.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Text className='text-gray-800 text-xl font-semibold mb-8'>{metrics[selectedMetricIndex].chartTitle}</Text>
            <BarChart
                scrollToEnd
                initialSpacing={0}
                data={chartData}
                height={200}
                width={windowDimensions.width - 120}
                spacing={10}
                barBorderRadius={6}
                rulesType='dashed'
                horizontalRulesStyle={{ opacity: 0.4 }}
                rulesColor={'gray'}
                yAxisColor="gray"
                xAxisColor="gray"
                frontColor="#22c55e"
                yAxisTextStyle={{ color: '#000000' }}
                noOfSections={8}
            />
            {/* <LineChart
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
            /> */}
            
        </View>
    )
}