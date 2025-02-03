import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import { storage } from "@/storage";

export default function useFetchAllExercises() {
    const storedExercisesString = storage.getString('data_exercises');
    const storedExercises: ExerciseDefinition[] = storedExercisesString ? JSON.parse(storedExercisesString) : [];

    return storedExercises;
}