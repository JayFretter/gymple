import { SetPerformanceData } from "@/interfaces/ExercisePerformanceData";

const kgToLbs: number = 2.20462;

export default function useCalculateVolume() {
    const calculateVolume = (sets: SetPerformanceData[], weightUnit: 'kg' | 'lbs') => {
        return sets.reduce((total, set) => {
            let setWeight = set.weight;
            if (set.weightUnit !== weightUnit) {
                setWeight = set.weightUnit === 'kg' ? setWeight * kgToLbs : setWeight / kgToLbs; // Convert kg to lbs or vice versa
            }
            return total + (setWeight * set.reps);
        }, 0);
    }

    return calculateVolume
}