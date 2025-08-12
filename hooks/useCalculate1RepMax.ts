import { WeightUnit } from "@/enums/weight-unit";
import { SetPerformanceData } from "@/interfaces/ExercisePerformanceData";

const kgToLbs: number = 2.20462;

export default function useCalculate1RepMax() {
    const calculate1RepMax = (sets: SetPerformanceData[], weightUnit: WeightUnit) => {
        // TODO: make this actually correct... (still broken)
        const set1RMs = sets.filter(set => set.type === 'weight').map(set => {
            if (set.reps === 0) {
                return 0;
            }

            // Convert weight to the selected unit if necessary
            let weight = set.weight;
            if (set.weightUnit !== weightUnit) {
                weight = set.weightUnit === WeightUnit.KG ? weight * kgToLbs : weight / kgToLbs; // Convert kg to lbs or vice versa
            }

            if (set.reps === 1)
                return weight;

            return weight * (1 + 0.03333 * set.reps);
        });

        return set1RMs.sort((a, b) => b - a)[0];
    }

    return calculate1RepMax
}