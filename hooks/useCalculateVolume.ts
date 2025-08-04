import { WeightUnit } from "@/enums/weight-unit";
import { SetPerformanceData } from "@/interfaces/ExercisePerformanceData";

const kgToLbs: number = 2.20462;

export default function useCalculateVolume() {
    const calculateVolume = (sets: SetPerformanceData[], weightUnit: WeightUnit) => {
        return sets.filter(s => s.type === 'weight').reduce((total, set) => {
            let setWeight = set.weight;
            if (set.weightUnit !== weightUnit) {
                setWeight = set.weightUnit === WeightUnit.KG ? setWeight * kgToLbs : setWeight / kgToLbs; // Convert kg to lbs or vice versa
            }
            return total + (setWeight * set.reps);
        }, 0);
    }

    return calculateVolume
}