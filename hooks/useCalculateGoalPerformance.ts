import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData"
import GoalDefinition from "@/interfaces/GoalDefinition"
import { storage } from "@/storage"

export default function useCalculateGoalPerformance() {
    const calculateGoalPerformance = (goal: GoalDefinition) : number => {
        // Fetch existing performance data for the goal's associated exercise
        const existingDataString = storage.getString(`data_exercise_${goal.associatedExerciseId}`);
        var performanceData: ExercisePerformanceData[] = existingDataString ? JSON.parse(existingDataString) : [];

        if (performanceData.length === 0) {
            return 0; // No performance data available
        }

        // Calculate best performance for goal
        let mostRepsWithGoalWeight = 0;
        performanceData.forEach((data) => {
            data.sets.forEach((set) => {
                if (set.weight === goal.weight) {
                    // For a weight goal, we consider the maximum reps achieved at that weight
                    if (set.reps > mostRepsWithGoalWeight) {
                        mostRepsWithGoalWeight = set.reps;
                    }
                }
            });
        });

        return (mostRepsWithGoalWeight / goal.reps) * 100; // Return percentage of goal achieved
    }

    return calculateGoalPerformance;
}