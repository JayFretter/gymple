import useCalculate1RepMax from "@/hooks/useCalculate1RepMax";
import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import { useEffect, useState } from "react";
import { Dimensions, View, Text, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-gifted-charts";

type ChartData = {
    value: number;
}

const windowDimensions = Dimensions.get('window');

interface PerformanceChartProps {
    performanceData: ExercisePerformanceData[]
}

export default function PerformanceChart({ performanceData }: PerformanceChartProps) {
    const [chartData, setChartData] = useState<ChartData[]>([])
    const [metric, setMetric] = useState<string>('FSW')
    const calculate1RM = useCalculate1RepMax();

    useEffect(() => {
        setupChartData();
    }, [performanceData, metric]);

    const setupChartData = () => {
        let calculatedChartData: ChartData[] = [];

        if (metric === 'FSW') {
            calculatedChartData = performanceData.map(data => {
                return {
                    value: data.sets[0].weight
                };
            });
        } else if (metric === '1RM') {
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

    return (
        <View className='w-[95%] flex items-center justify-center mb-12 bg-white p-4 rounded-lg shadow-lg'>
            <Text className='text-gray-800 text-xl font-semibold mb-8'>First Set Weight Over Time</Text>
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
                    className={`flex-1 rounded-lg py-1 ${metric === 'FSW' ? 'bg-[#03a1fc]' : 'bg-gray-400'}`}
                    onPress={() => setMetric('FSW')}
                >
                    <Text className="text-white text-center font-semibold">First Set Weight</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 rounded-lg py-1 ${metric === '1RM' ? 'bg-[#03a1fc]' : 'bg-gray-400'}`}
                    onPress={() => setMetric('1RM')}
                >
                    <Text className="text-white text-center font-semibold">1RM</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}