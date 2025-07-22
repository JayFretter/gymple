import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import { storage } from "@/storage";
import useCalculateMaxes from "./useCalculateMaxes";
import useCalculateVolume from "./useCalculateVolume";


export default function useUpdateExerciseMaxes() {
    const calculateMaxes = useCalculateMaxes();
    const calculateVolume = useCalculateVolume();

    const updateExerciseMaxes = (exerciseId: string, performanceThisSession: ExercisePerformanceData) => {
        const exerciseDataString = storage.getString(`data_exercises`);
        if (!exerciseDataString) {
            return;
        }

        const exercises = JSON.parse(exerciseDataString) as ExerciseDefinition[];
        const currentExercise = exercises.find(exercise => exercise.id === exerciseId);
        
        if (!currentExercise) {
            return;
        }

        const [newOneRepMaxInKg, newEstimated1rmInKg] = calculateMaxes(performanceThisSession, 'kg');
        const volumeInKg = calculateVolume(performanceThisSession.sets, 'kg');

        if (newEstimated1rmInKg > (currentExercise.estimatedOneRepMaxInKg ?? 0))
            currentExercise.estimatedOneRepMaxInKg = newEstimated1rmInKg;

        if (newOneRepMaxInKg > (currentExercise.oneRepMaxInKg ?? 0))
            currentExercise.oneRepMaxInKg = newOneRepMaxInKg;

        if (volumeInKg > (currentExercise.maxVolumeInKg ?? 0))
            currentExercise.maxVolumeInKg = volumeInKg;

        // Update the exercise data in storage
        storage.set(`data_exercises`, JSON.stringify(exercises));
    }

    return updateExerciseMaxes
}