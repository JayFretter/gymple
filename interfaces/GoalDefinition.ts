export default interface GoalDefinition {
    id: string;
    associatedExerciseId: string;
    associatedExerciseName: string;
    weight: number;
    reps: number;
    percentage: number;
}