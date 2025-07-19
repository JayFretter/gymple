import GoalDefinition from "@/interfaces/GoalDefinition"
import { storage } from "@/storage"

export default function useDeleteGoal() {
    const deleteGoal = (goalId: string) => {
        const existingGoals = storage.getString('data_goals');
        var goals: GoalDefinition[] = existingGoals ? JSON.parse(existingGoals) : [];

        const newGoals = goals.filter(g => g.id !== goalId);
        storage.set('data_goals', JSON.stringify(newGoals));
    }

    return deleteGoal;
}