export default interface GoalDefinition {
    id: string;
    associatedExerciseId: string;
    associatedExerciseName: string;
    weight: number;
    weightUnit: 'kg' | 'lbs';
    reps: number;
    percentage: number;
}