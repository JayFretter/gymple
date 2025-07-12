import GoalDefinition from "@/interfaces/GoalDefinition"
import { storage } from "@/storage"

export default function useFetchAssociatedGoalsForExercise() {
    const fetchAssociatedGoalsForExercise = (exerciseId: string): GoalDefinition[] => {
        // Fetch existing performance data for the goal's associated exercise
        const existingDataString = storage.getString('data_goals');
        var allGoals: GoalDefinition[] = existingDataString ? JSON.parse(existingDataString) : [];

        return allGoals.filter(goal => goal.associatedExerciseId === exerciseId);
    }

    return fetchAssociatedGoalsForExercise;
}