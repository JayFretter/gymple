import ExerciseDefinition from "./ExerciseDefinition";

export default interface WorkoutPageItem {
    id: string;
    title: string;
    exercises: ExerciseDefinition[];
}