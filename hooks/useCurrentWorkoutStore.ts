import Achievement from '@/interfaces/Achievement';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import { create } from 'zustand';

interface CurrentWorkoutState {
    workoutStartedTimestamp?: number;
    currentWorkout?: WorkoutDefinition;
    currentExerciseIndex: number;
    achievements: Achievement[];
    setWorkoutStartedTimestamp: (timestamp: number) => void;
    resetWorkoutStartedTimestamp: () => void;
    setCurrentWorkout: (workout: WorkoutDefinition) => void;
    resetCurrentWorkout: () => void;
    setCurrentExerciseIndex: (index: number) => void;
    resetCurrentExerciseIndex: () => void;
    addAchievement: (achievement: Achievement) => void;
    resetAchievements: () => void;
    resetAll: () => void;
}

const useCurrentWorkoutStore = create<CurrentWorkoutState>((set) => ({
    workoutStartedTimestamp: undefined,
    currentWorkout: undefined,
    currentExerciseIndex: 0,
    achievements: [],
    setWorkoutStartedTimestamp: (timestamp: number) => set({ workoutStartedTimestamp: timestamp }),
    resetWorkoutStartedTimestamp: () => set({ workoutStartedTimestamp: undefined }),
    setCurrentWorkout: (workout: WorkoutDefinition) => set({ currentWorkout: workout }),
    resetCurrentWorkout: () => set({ currentWorkout: undefined }),
    setCurrentExerciseIndex: (index: number) => set({ currentExerciseIndex: index }),
    resetCurrentExerciseIndex: () => set({ currentExerciseIndex: 0 }),
    addAchievement: (achievement: Achievement) => set((state) => ({achievements: [...state.achievements, achievement]})),
    resetAchievements: () => set({ achievements: [] }),
    resetAll: () => set({workoutStartedTimestamp: undefined, currentWorkout: undefined, achievements: [], currentExerciseIndex: 0})
}))

export default useCurrentWorkoutStore;