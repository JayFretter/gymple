import { WeightUnit } from "@/enums/weight-unit";
import useUserPreferences from "@/hooks/useUserPreferences";
import { useEffect, useState } from "react";
import { Dimensions, View, Text } from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import useStorage from "@/hooks/useStorage";
import { SessionDefinition } from "@/interfaces/SessionDefinition";
import NoDataYetChart from "./shared/NoDataYetChart";

type ChartData = {
  value: number;
}

type ChartMetric = {
  name: string;
  chartTitle: string;
}

const windowDimensions = Dimensions.get('window');

interface WorkoutPerformanceChartProps {
  className?: string;
  workoutId: string;
}

export default function WorkoutPerformanceChart({ className, workoutId }: WorkoutPerformanceChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const { fetchFromStorage } = useStorage();

  useEffect(() => {
    // Fetch all sessions and filter by workoutId
    const allSessions = fetchFromStorage<SessionDefinition[]>("data_sessions") ?? [];
    const relevantSessions = allSessions.filter(session => session.workoutId === workoutId);

    // Filter sessions from the last 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const recentSessions = relevantSessions.filter(session => {
      return session.timestamp >= Math.floor(threeMonthsAgo.getTime());
    });

    // Prepare chart data for Volume metric
    const chartData = recentSessions.map(session => ({
      value: session.volumeInKg
    }));
    setChartData(chartData);
  }, [workoutId]);

  return (
    <View className={className + ' w-full flex items-center justify-center'}>
      <Text className="text-txt-primary text-xl font-bold mb-4">Volume (Last 3 Months)</Text>
      {chartData.length === 0 ? (
        <NoDataYetChart width={100} height={100} overlayColour="primary" />
      ) : (
        <LineChart
          overflowTop={1}
          areaChart
          isAnimated
          animationDuration={400}
          startFillColor1="#068bec"
          scrollToEnd
          startOpacity={0.8}
          endOpacity={0}
          initialSpacing={0}
          data={chartData}
          height={100}
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
          yAxisTextStyle={{ color: '#aaaaaa', fontSize: 12 }}
          noOfSections={3}
          dataPointsRadius={4}
          dataPointsColor="#068bec"
          dataPointsShape="circle"
          showValuesAsDataPointsText
          textShiftX={4}
          textShiftY={-4}
        />
      )}
    </View>
  );
}