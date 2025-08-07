import Achievement from '@/interfaces/Achievement';
import ExercisePerformanceData from '@/interfaces/ExercisePerformanceData';
import GoalDefinition from '@/interfaces/GoalDefinition';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import uuid from 'react-native-uuid';
import { create } from 'zustand';

interface OngoingWorkoutState {
    sessionId?: string;
    workoutId?: string;
    workoutName?: string;
    exerciseIds: string[];
    workoutStartedTimestamp?: number;
    workoutFinishedTimestamp?: number;
    achievements: Achievement[];
    completedGoals: GoalDefinition[];
    performanceData: ExercisePerformanceData[];
    setWorkout: (workout: WorkoutDefinition) => void;
    resetWorkout: () => void;
    resetWorkoutId: () => void;
    setExerciseIds: (exerciseIds: string[]) => void;
    setWorkoutStartedTimestamp: (timestamp: number) => void;
    resetWorkoutStartedTimestamp: () => void;
    setWorkoutFinishedTimestamp: (timestamp: number) => void;
    resetWorkoutFinishedTimestamp: () => void;
    addAchievement: (achievement: Achievement) => void;
    setAchievements: (achievements: Achievement[]) => void;
    resetAchievements: () => void;
    addCompletedGoal: (goal: GoalDefinition) => void;
    resetCompletedGoals: () => void;
    addPerformanceData: (data: ExercisePerformanceData) => void;
    removePerformanceData: (exerciseId: string) => void;
    resetAll: () => void;
}

const useOngoingWorkoutStore = create<OngoingWorkoutState>((set) => ({
    sessionId: undefined,
    workoutId: undefined,
    workoutName: undefined,
    exerciseIds: [],
    workoutStartedTimestamp: undefined,
    workoutFinishedTimestamp: undefined,
    currentExerciseIndex: 0,
    achievements: [],
    completedGoals: [],
    performanceData: [],
    setWorkout: (workout: WorkoutDefinition) => set({ sessionId: uuid.v4(), workoutId: workout.id, workoutName: workout.title, exerciseIds: workout.exerciseIds }),
    resetWorkout: () => set({ workoutId: undefined, workoutName: undefined, exerciseIds: [] }),
    resetWorkoutId: () => set({ workoutId: undefined }),
    setExerciseIds: (exerciseIds: string[]) => set({ exerciseIds }),
    setWorkoutStartedTimestamp: (timestamp: number) => set({ workoutStartedTimestamp: timestamp }),
    resetWorkoutStartedTimestamp: () => set({ workoutStartedTimestamp: undefined }),
    setWorkoutFinishedTimestamp: (timestamp: number) => set({ workoutFinishedTimestamp: timestamp }),
    resetWorkoutFinishedTimestamp: () => set({ workoutFinishedTimestamp: undefined }),
    addAchievement: (achievement: Achievement) => set((state) => ({ achievements: [...state.achievements, achievement] })),
    setAchievements: (achievements: Achievement[]) => set({ achievements }),
    resetAchievements: () => set({ achievements: [] }),
    addCompletedGoal: (goal: GoalDefinition) => set((state) => ({ completedGoals: [...state.completedGoals, goal] })),
    resetCompletedGoals: () => set({ completedGoals: [] }),
    addPerformanceData: (data: ExercisePerformanceData) =>
        set((state) => ({ performanceData: [...state.performanceData.filter(perfData => perfData.exerciseId !== data.exerciseId), data] })),
    removePerformanceData: (exerciseId: string) =>
        set((state) => ({
            performanceData: state.performanceData.filter(perfData => perfData.exerciseId !== exerciseId)
        })),
    resetAll: () => set({ workoutId: undefined, workoutName: undefined, exerciseIds: [], workoutStartedTimestamp: undefined, workoutFinishedTimestamp: undefined, achievements: [], completedGoals: [], performanceData: [] })
}))

export default useOngoingWorkoutStore;