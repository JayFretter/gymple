import { storage } from '@/storage';
import baseExercises from '@/seeded_data/base_exercises.json'
import baseGoals from '@/seeded_data/base_goals.json'
import baseAchievements from '@/seeded_data/base_achievements.json'
import baseSessions from '@/seeded_data/base_sessions.json'

export function useDataSeeding() {
    const seedBaseData = () => {
        storage.clearAll();

        storage.set('data_exercises', JSON.stringify(baseExercises));
        storage.set('data_goals', JSON.stringify(baseGoals));
        storage.set('data_achievements', JSON.stringify(baseAchievements));
        storage.set('data_sessions', JSON.stringify(baseSessions));
    }

    return seedBaseData;
}