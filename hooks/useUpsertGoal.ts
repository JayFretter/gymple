import GoalDefinition from "@/interfaces/GoalDefinition"
import { storage } from "@/storage"

export default function useUpsertGoal() {
    const upsertGoal = (goal: GoalDefinition) => {
        const existingGoals = storage.getString('data_goals');
        var goals: GoalDefinition[] = existingGoals ? JSON.parse(existingGoals) : [];

        const newGoals = goals.filter(g => g.id !== goal.id);
        newGoals.push(goal);
        storage.set('data_goals', JSON.stringify(newGoals));
    }

    return upsertGoal;
}