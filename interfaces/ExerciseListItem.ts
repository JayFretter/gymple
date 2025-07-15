import ExerciseDefinition from "./ExerciseDefinition";

export default interface ExerciseListItem {
    exercise: ExerciseDefinition;
    selected: boolean;
}