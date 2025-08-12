import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import { SetPerformanceData } from "@/interfaces/ExercisePerformanceData";
import RecordCard from "./RecordCard";
import { roundHalf } from "@/utils/maths-utils";
import { JSX } from "react";
import useCalculate1RepMax from "@/hooks/useCalculate1RepMax";
import useCalculateVolume from "@/hooks/useCalculateVolume";
import { WeightUnit } from "@/enums/weight-unit";
import { View } from "react-native";

export interface ExerciseRecordListProps {
  exercise: ExerciseDefinition | null;
  currentPerformanceData: SetPerformanceData[];
  className?: string;
}

export default function ExerciseRecordList({ exercise, currentPerformanceData, className }: ExerciseRecordListProps) {
  const calculateVolume = useCalculateVolume();
  const calculateOneRepMax = useCalculate1RepMax();

  const atLeastOneSetCompleted = () => {
    return currentPerformanceData.filter(s => s.type === 'weight').some(set => set.reps > 0);
  }

  const renderNewRecords = () => {
    if (currentPerformanceData.length === 0 && atLeastOneSetCompleted()) {
      return (
        <RecordCard className='mt-4' title='1st time performing exercise' />
      );
    }

    const records: JSX.Element[] = [];

    const oldVolume = roundHalf(exercise?.maxVolumeInKg ?? 0);
    const newVolume = roundHalf(calculateVolume(currentPerformanceData, WeightUnit.KG));
    if (newVolume > oldVolume) {
      records.push(
        <RecordCard title='New volume record!' oldValue={oldVolume} newValue={newVolume} />
      );
    }

    const oldEstimated1rm = roundHalf(exercise?.estimatedOneRepMaxInKg ?? 0);
    const newEstimated1rm = roundHalf(calculateOneRepMax(currentPerformanceData, WeightUnit.KG));
    if (newEstimated1rm > oldEstimated1rm) {
      records.push(
        <RecordCard title='New estimated 1 rep max!' oldValue={oldEstimated1rm} newValue={newEstimated1rm} />
      );
    }

    return (
      <View className='flex gap-2'>
        {records.map((record, index) => (
          <View key={index}>
            {record}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View className={className}>
      {renderNewRecords()}
    </View>
  );
}