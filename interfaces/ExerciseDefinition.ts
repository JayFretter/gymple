export default interface ExerciseDefinition {
    id: string;
    name: string;
    category: string;
    notes: string;
    oneRepMaxInKg?: number;
    estimatedOneRepMaxInKg?: number;
}