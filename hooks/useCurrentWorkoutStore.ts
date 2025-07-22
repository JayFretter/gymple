import Achievement from '@/interfaces/Achievement';
import ExercisePerformanceData from '@/interfaces/ExercisePerformanceData';
import GoalDefinition from '@/interfaces/GoalDefinition';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import { create } from 'zustand';

interface CurrentWorkoutState {
    workoutStartedTimestamp?: number;
    currentWorkout?: WorkoutDefinition;
    currentExerciseIndex: number;
    achievements: Achievement[];
    completedGoals: GoalDefinition[];
    performanceData: ExercisePerformanceData[];
    setWorkoutStartedTimestamp: (timestamp: number) => void;
    resetWorkoutStartedTimestamp: () => void;
    setCurrentWorkout: (workout: WorkoutDefinition) => void;
    resetCurrentWorkout: () => void;
    setCurrentExerciseIndex: (index: number) => void;
    resetCurrentExerciseIndex: () => void;
    addAchievement: (achievement: Achievement) => void;
    resetAchievements: () => void;
    addCompletedGoal: (goal: GoalDefinition) => void;
    resetCompletedGoals: () => void;
    addPerformanceData: (data: ExercisePerformanceData) => void;
    resetAll: () => void;
}

const useCurrentWorkoutStore = create<CurrentWorkoutState>((set) => ({
    workoutStartedTimestamp: undefined,
    currentWorkout: undefined,
    currentExerciseIndex: 0,
    achievements: [],
    completedGoals: [],
    performanceData: [],
    setWorkoutStartedTimestamp: (timestamp: number) => set({ workoutStartedTimestamp: timestamp }),
    resetWorkoutStartedTimestamp: () => set({ workoutStartedTimestamp: undefined }),
    setCurrentWorkout: (workout: WorkoutDefinition) => set({ currentWorkout: workout }),
    resetCurrentWorkout: () => set({ currentWorkout: undefined }),
    setCurrentExerciseIndex: (index: number) => set({ currentExerciseIndex: index }),
    resetCurrentExerciseIndex: () => set({ currentExerciseIndex: 0 }),
    addAchievement: (achievement: Achievement) => set((state) => ({achievements: [...state.achievements, achievement]})),
    resetAchievements: () => set({ achievements: [] }),
    addCompletedGoal: (goal: GoalDefinition) => set((state) => ({completedGoals: [...state.completedGoals, goal]})),
    resetCompletedGoals: () => set({ completedGoals: [] }),
    addPerformanceData: (data: ExercisePerformanceData) => 
        set((state) => ({performanceData: [...state.performanceData.filter(perfData => perfData.exerciseId !== data.exerciseId), data]})),
    resetAll: () => set({workoutStartedTimestamp: undefined, currentWorkout: undefined, achievements: [], completedGoals: [], currentExerciseIndex: 0, performanceData: []})
}))

export default useCurrentWorkoutStore;