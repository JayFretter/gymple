import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import useCalculate1RepMax from "./useCalculate1RepMax";
import { WeightUnit } from "@/enums/weight-unit";

const kgToLbs: number = 2.20462;

export default function useCalculateMaxes() {
  const calculate1RM = useCalculate1RepMax();

  const calculateMaxes = (performance: ExercisePerformanceData, weightUnit: WeightUnit) => {
    const newEstimated1rm = calculate1RM(performance.sets, weightUnit);

    // Heaviest weight ever used in any set (regardless of reps)
    const heaviestWeight = Math.max(
      0,
      ...performance.sets
        .filter(set => set.type === 'weight')
        .map(set => set.weightUnit === WeightUnit.KG ? set.weight : set.weight / kgToLbs)
    );

    return [heaviestWeight, newEstimated1rm];
  };

  return calculateMaxes;
}