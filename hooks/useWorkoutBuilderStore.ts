import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { create } from 'zustand'

interface WorkoutBuilderState {
    exercises: ExerciseDefinition[];
    addExercise: (exercise: ExerciseDefinition) => void;
    clearAll: () => void;
}

const useWorkoutBuilderStore = create<WorkoutBuilderState>((set) => ({
    exercises: [],
    addExercise: (exercise) => set((state) => ({ exercises: [...state.exercises, exercise] })),
    clearAll: () => set({ exercises: [] }),
}))

export default useWorkoutBuilderStore;