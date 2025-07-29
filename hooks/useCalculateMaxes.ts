import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import useCalculate1RepMax from "./useCalculate1RepMax";
import { WeightUnit } from "@/enums/weight-unit";

const kgToLbs: number = 2.20462;

export default function useCalculateMaxes() {
    const calculate1RM = useCalculate1RepMax();

    const calculateMaxes = (performance: ExercisePerformanceData, weightUnit: WeightUnit) => {
        const newEstimated1rm = calculate1RM(performance, weightUnit);

        let newOneRepMax = 0;
        performance.sets.forEach(set => {
            if (set.reps === 1) {
                let setWeight = set.weight;
                if (set.weightUnit !== weightUnit) {
                    setWeight = set.weightUnit === WeightUnit.KG ? setWeight * kgToLbs : setWeight / kgToLbs; // Convert kg to lbs or vice versa
                }
                
                if (setWeight > newOneRepMax) {
                    newOneRepMax = setWeight;
                }
            }
        });

        return [newOneRepMax, newEstimated1rm];
    }

    return calculateMaxes
}