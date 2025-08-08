import { ThemeColourName } from "@/hooks/useThemeColours";
import { useState } from "react";
import { View, Text, LayoutChangeEvent } from "react-native";
import { LineChart } from "react-native-gifted-charts";

type ChartData = {
  value: number;
}

const chartData: ChartData[] = [
  { value: 120 },
  { value: 185 },
  { value: 170 },
  { value: 198 },
  { value: 220 },
  { value: 210 },
  { value: 235 },
  { value: 265 },
  { value: 278 },
  { value: 288 },
  // { value: 290 }
];

interface NoDataYetChartProps {
  className?: string;
  width: number;
  height: number;
  overlayColour?: ThemeColourName;
}

export default function NoDataYetChart({ className, width, height, overlayColour = 'card' }: NoDataYetChartProps) {
  const [chartParentWidth, setChartParentWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setChartParentWidth(width);
    console.log('Chart parent width:', width);
  };

  return (
    <View className="w-full flex items-center justify-center" onLayout={handleLayout}>
      <View className={`absolute w-full h-full flex items-center justify-center z-10`}>
        <Text className="text-txt-secondary mb-4">No data yet.</Text>
      </View>
      <LineChart
        areaChart
        startFillColor1="#068bec"
        hideYAxisText
        startOpacity={0.1}
        endOpacity={0}
        initialSpacing={0}
        data={chartData}
        height={height}
        adjustToWidth
        // scrollToEnd
        width={chartParentWidth}
        // spacing={30}
        yAxisLabelWidth={0}
        thickness={2}
        rulesType='solid'
        hideRules
        horizontalRulesStyle={{ opacity: 0.1 }}
        yAxisColor="#068bec"
        xAxisColor="#068bec"
        color="#068bec11"
        textColor='#aaaaaa'
        noOfSections={4}
        dataPointsRadius={4}
        dataPointsColor="#068bec22"
        dataPointsShape="circle"
      />
    </View>
  )
}