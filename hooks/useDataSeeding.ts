import { storage } from '@/storage';
import baseExercises from '@/seeded_data/base_exercises.json'

export function useDataSeeding() {
    const seedBaseExercises = () => {
        storage.clearAll();
        storage.set('data_exercises', JSON.stringify(baseExercises));
    }

    return seedBaseExercises;
}