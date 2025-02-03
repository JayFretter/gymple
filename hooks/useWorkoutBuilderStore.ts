import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { create } from 'zustand'

interface WorkoutBuilderState {
    exercises: ExerciseDefinition[];
    setExercises: (exercises: ExerciseDefinition[]) => void;
    addExercise: (exercise: ExerciseDefinition) => void;
    removeExercise: (exerciseId: string) => void;
    clearAll: () => void;
}

const useWorkoutBuilderStore = create<WorkoutBuilderState>((set) => ({
    exercises: [],
    setExercises: (exercises) => set({ exercises }),
    addExercise: (exercise) => set((state) => ({ exercises: [...state.exercises, exercise] })),
    removeExercise: (exerciseId) => set((state) => ({ exercises: state.exercises.filter(e => e.id !== exerciseId) })),
    clearAll: () => set({ exercises: [] }),
}))

export default useWorkoutBuilderStore;