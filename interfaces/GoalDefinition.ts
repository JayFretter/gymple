export default interface GoalDefinition {
    id: string;
    associatedExerciseId: string;
    associatedExerciseName: string;
    weight: number;
    weightUnit: WeightUnit;
    reps: number;
    percentage: number;
}