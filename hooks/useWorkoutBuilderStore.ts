
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';
import { create } from 'zustand';

export interface ExerciseWithSets {
  exercise: ExerciseDefinition;
  sets: number;
}

interface WorkoutBuilderState {
  exercises: ExerciseWithSets[];
  isSingleExerciseMode: boolean;
  setExercises: (exercises: ExerciseWithSets[]) => void;
  addExercise: (exercise: ExerciseDefinition) => void;
  removeExercise: (exerciseId: string) => void;
  updateSets: (exerciseId: string, sets: number) => void;
  setIsSingleExerciseMode: (isSingleExerciseMode: boolean) => void;
  clearAll: () => void;
}

const useWorkoutBuilderStore = create<WorkoutBuilderState>((set) => ({
  exercises: [],
  isSingleExerciseMode: false,
  setExercises: (exercises) => set({ exercises }),
  addExercise: (exercise) => set((state) => ({
    exercises: [...state.exercises, { exercise, sets: 3 }], // default 3 sets
  })),
  removeExercise: (exerciseId) => set((state) => ({
    exercises: state.exercises.filter(e => e.exercise.id !== exerciseId),
  })),
  updateSets: (exerciseId, sets) => set((state) => ({
    exercises: state.exercises.map(e =>
      e.exercise.id === exerciseId ? { ...e, sets: sets < 1 ? 1 : sets } : e
    ),
  })),
  setIsSingleExerciseMode: (isSingleExerciseMode: boolean) => set({ isSingleExerciseMode }),
  clearAll: () => set({ exercises: [] }),
}));

export default useWorkoutBuilderStore;