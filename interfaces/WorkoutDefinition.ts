
export interface ExerciseInWorkout {
  id: string;
  sets: number;
}

export default interface WorkoutDefinition {
  id: string;
  title: string;
  exercises: ExerciseInWorkout[];
  maxVolumeInKg?: number;
}