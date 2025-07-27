import Achievement from '@/interfaces/Achievement';
import ExercisePerformanceData from '@/interfaces/ExercisePerformanceData';
import GoalDefinition from '@/interfaces/GoalDefinition';
import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import { create } from 'zustand';
import { produce } from 'immer'
import ExerciseDefinition from '@/interfaces/ExerciseDefinition';

interface OngoingWorkoutState {
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
    setExerciseIds: (exerciseIds: string[]) => void;
    setWorkoutStartedTimestamp: (timestamp: number) => void;
    resetWorkoutStartedTimestamp: () => void;
    setWorkoutFinishedTimestamp: (timestamp: number) => void;
    resetWorkoutFinishedTimestamp: () => void;
    addAchievement: (achievement: Achievement) => void;
    resetAchievements: () => void;
    addCompletedGoal: (goal: GoalDefinition) => void;
    resetCompletedGoals: () => void;
    addPerformanceData: (data: ExercisePerformanceData) => void;
    resetAll: () => void;
}

const useOngoingWorkoutStore = create<OngoingWorkoutState>((set) => ({
    workoutId: undefined,
    workoutName: undefined,
    exerciseIds: [],
    workoutStartedTimestamp: undefined,
    workoutFinishedTimestamp: undefined,
    currentExerciseIndex: 0,
    achievements: [],
    completedGoals: [],
    performanceData: [],
    setWorkout: (workout: WorkoutDefinition) => set({ workoutId: workout.id, workoutName: workout.title, exerciseIds: workout.exerciseIds }),
    resetWorkout: () => set({ workoutId: undefined, workoutName: undefined, exerciseIds: [] }),
    setExerciseIds: (exerciseIds: string[]) => set({ exerciseIds }),
    setWorkoutStartedTimestamp: (timestamp: number) => set({ workoutStartedTimestamp: timestamp }),
    resetWorkoutStartedTimestamp: () => set({ workoutStartedTimestamp: undefined }),
    setWorkoutFinishedTimestamp: (timestamp: number) => set({ workoutFinishedTimestamp: timestamp }),
    resetWorkoutFinishedTimestamp: () => set({ workoutFinishedTimestamp: undefined }),
    addAchievement: (achievement: Achievement) => set((state) => ({ achievements: [...state.achievements, achievement] })),
    resetAchievements: () => set({ achievements: [] }),
    addCompletedGoal: (goal: GoalDefinition) => set((state) => ({ completedGoals: [...state.completedGoals, goal] })),
    resetCompletedGoals: () => set({ completedGoals: [] }),
    addPerformanceData: (data: ExercisePerformanceData) =>
        set((state) => ({ performanceData: [...state.performanceData.filter(perfData => perfData.exerciseId !== data.exerciseId), data] })),
    resetAll: () => set({ workoutId: undefined, workoutName: undefined, exerciseIds: [], workoutStartedTimestamp: undefined, workoutFinishedTimestamp: undefined, achievements: [], completedGoals: [], performanceData: [] })
}))

export default useOngoingWorkoutStore;