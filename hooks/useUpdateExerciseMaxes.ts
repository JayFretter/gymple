import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import ExercisePerformanceData from "@/interfaces/ExercisePerformanceData";
import { storage } from "@/storage";
import useCalculateMaxes from "./useCalculateMaxes";
import useCalculateVolume from "./useCalculateVolume";
import { WeightUnit } from "@/enums/weight-unit";


export default function useUpdateExerciseMaxes() {
    const calculateMaxes = useCalculateMaxes();
    const calculateVolume = useCalculateVolume();

    const updateExerciseMaxes = (performanceThisSession: ExercisePerformanceData) => {
        const exerciseDataString = storage.getString(`data_exercises`);
        if (!exerciseDataString) {
            return;
        }

        const exercises = JSON.parse(exerciseDataString) as ExerciseDefinition[];
        const currentExercise = exercises.find(exercise => exercise.id === performanceThisSession.exerciseId);
        
        if (!currentExercise) {
            return;
        }

        const [newOneRepMaxInKg, newEstimated1rmInKg] = calculateMaxes(performanceThisSession, WeightUnit.KG);
        const volumeInKg = calculateVolume(performanceThisSession.sets, WeightUnit.KG);

        if (currentExercise.estimatedOneRepMaxInKg === undefined)
            currentExercise.estimatedOneRepMaxInKg = 0;

        if (currentExercise.maxVolumeInKg === undefined)
            currentExercise.maxVolumeInKg = 0;
        
        if (newOneRepMaxInKg > (currentExercise.oneRepMaxInKg ?? 0))
            currentExercise.oneRepMaxInKg = newOneRepMaxInKg;

        if (newEstimated1rmInKg > currentExercise.estimatedOneRepMaxInKg)
            currentExercise.estimatedOneRepMaxInKg = newEstimated1rmInKg;

        if (volumeInKg > currentExercise.maxVolumeInKg)
            currentExercise.maxVolumeInKg = volumeInKg;

        // Update the exercise data in storage
        storage.set(`data_exercises`, JSON.stringify(exercises));
    }

    return updateExerciseMaxes
}