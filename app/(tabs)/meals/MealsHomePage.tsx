import MealList from "@/components/shared/MealList";
import GradientPressable from "@/components/shared/GradientPressable";
import MealSummaryChart from "@/components/shared/MealSummaryChart";
import useMealStorage from "@/hooks/useMealStorage";
import { Meal } from "@/interfaces/Meal";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInLeft, FadeInUp, FadeOut, FadeOutDown, FadeOutLeft, FadeOutRight } from 'react-native-reanimated';
import { AntDesign, Feather } from "@expo/vector-icons";
import { format, isToday, isYesterday } from "date-fns";


const TODAY_LABEL = "Today";
const YESTERDAY_LABEL = "Yesterday";

function getStartOfDayTimestamp(timestamp: number): number {
  const now = new Date(timestamp);
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

function getEndOfDayTimestamp(timestamp: number): number {
  const now = new Date(timestamp);
  now.setHours(23, 59, 59, 999);
  return now.getTime();
}

export default function MealsHomePage() {
  const router = useRouter();
  const { fetchMeals } = useMealStorage();
  const [meals, setMeals] = useState<Meal[]>([]);
  const isFocused = useIsFocused();
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  useEffect(() => {
    if (isFocused || selectedDay) {
      const start = getStartOfDayTimestamp(selectedDay instanceof Date ? selectedDay.getTime() : selectedDay);
      const end = getEndOfDayTimestamp(selectedDay instanceof Date ? selectedDay.getTime() : selectedDay);
      const mealsForDay = fetchMeals().filter(meal => meal.timestamp >= start && meal.timestamp <= end);
      setMeals(mealsForDay);
    }
  }, [isFocused, selectedDay]);

  const handleTrackMeal = () => {
    router.push("/meals/TrackMealPage");
  };

  const handlePrevDay = () => {
    setSelectedDay(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const handleNextDay = () => {
    setSelectedDay(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
  };

  // Label for the selected day
  let dayLabel = "";
  if (isToday(selectedDay)) {
    dayLabel = TODAY_LABEL;
  } else if (isYesterday(selectedDay)) {
    dayLabel = YESTERDAY_LABEL;
  } else {
    dayLabel = format(selectedDay, "MMM d, yyyy");
  }

  const handleJumpToToday = () => {
    setSelectedDay(new Date());
  };

  return (
    <View className="flex-1 bg-primary px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-4xl font-bold self-start text-txt-primary mt-4">Meals</Text>
        {/* Day Selector */}
        <View className="flex-row items-center justify-center gap-4 mt-6">
          <AntDesign
            name="left"
            size={20}
            color="#aaaaaa"
            onPress={handlePrevDay}
            style={{ opacity: 1 }}
            />
          <Text className="text-2xl font-semibold text-txt-secondary min-w-[120px] text-center">{dayLabel}</Text>
          <AntDesign
            name="right"
            size={20}
            color="#aaaaaa"
            onPress={isToday(selectedDay) ? undefined : handleNextDay}
            style={{ opacity: isToday(selectedDay) ? 0.3 : 1 }}
            />
        </View>
        {
          !isToday(selectedDay) && (
            <Pressable
              className="mx-auto"
              onPress={handleJumpToToday}
            >
              <View className="flex-row items-center justify-center gap-2 p-2">
                <Feather name="calendar" size={14} color="#555555" />
                <Text className="text-txt-tertiary text-center font-bold">Go To Today</Text>
              </View>
            </Pressable>
          )
        }
        <Animated.View
          key={dayLabel}
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(250)}
        >
          <View className="flex-row items-center gap-2 mt-8">
            <Text className="text-2xl font-semibold self-start text-txt-secondary">Summary</Text>
            <Feather name="bar-chart-2" size={24} color="#aaaaaa" />
          </View>
          <MealSummaryChart className="" meals={meals} />
          <Text className="text-2xl font-semibold self-start text-txt-secondary mt-8">Meals</Text>
          {dayLabel === TODAY_LABEL && <GradientPressable
            className="mt-4"
            style='default'
            onPress={handleTrackMeal}
          >
            <View className="flex-row items-center justify-center gap-2 p-2">
              <AntDesign name="plus" size={14} color="white" />
              <Text className="text-txt-primary text-center font-bold">Add Meal</Text>
            </View>
          </GradientPressable>}
          <MealList
            className="mt-4"
            meals={meals}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}