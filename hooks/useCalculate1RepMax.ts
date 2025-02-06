import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData"

export default function useCalculate1RepMax() {
    const calculate1RepMax = (performanceData: ExercisePerformanceData) => {
        // TODO: make this actually correct... (still broken)
        const set1RMs = performanceData.sets.map(set => {
            return set.weight * (1 + 0.03333 * set.reps);
        });

        console.log(set1RMs);

        return set1RMs.sort((a, b) => b - a)[0];
    }

    return calculate1RepMax
}