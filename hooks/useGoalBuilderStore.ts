import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { create } from 'zustand'

interface GoalBuilderState {
    exercise: ExerciseDefinition | null;
    setExercise: (exercise: ExerciseDefinition) => void;
    removeExercise: () => void;
}

const useGoalBuilderStore = create<GoalBuilderState>((set) => ({
    exercise: null,
    setExercise: (exercise) => set({ exercise }),
    removeExercise: () => set({ exercise: null})
}))

export default useGoalBuilderStore;