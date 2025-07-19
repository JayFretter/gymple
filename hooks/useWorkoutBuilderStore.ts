import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { create } from 'zustand'

interface WorkoutBuilderState {
    exercises: ExerciseDefinition[];
    isSingleExerciseMode: boolean;
    setExercises: (exercises: ExerciseDefinition[]) => void;
    addExercise: (exercise: ExerciseDefinition) => void;
    removeExercise: (exerciseId: string) => void;
    setIsSingleExerciseMode: (isSingleExerciseMode: boolean) => void;
    clearAll: () => void;
}

const useWorkoutBuilderStore = create<WorkoutBuilderState>((set) => ({
    exercises: [],
    isSingleExerciseMode: false,
    setExercises: (exercises) => set({ exercises }),
    addExercise: (exercise) => set((state) => ({ exercises: [...state.exercises, exercise] })),
    removeExercise: (exerciseId) => set((state) => ({ exercises: state.exercises.filter(e => e.id !== exerciseId) })),
    setIsSingleExerciseMode: (isSingleExerciseMode: boolean) => set({ isSingleExerciseMode }),
    clearAll: () => set({ exercises: [] }),
}))

export default useWorkoutBuilderStore;