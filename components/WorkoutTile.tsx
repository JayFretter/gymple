import WorkoutDefinition from '@/interfaces/WorkoutDefinition';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export type WorkoutTileProps = {
  workoutDefinition: WorkoutDefinition;
};

export function WorkoutTile(props: WorkoutTileProps) {
  return (
    <TouchableOpacity
      className='bg-slate-700 w-[90%] p-4 flex items-center justify-center rounded-3xl'
      onPress={() => router.push({ pathname: '/(workouts)/ViewWorkoutPage', params: { workoutId: props.workoutDefinition.id } })}
    >
      <Text className='text-4xl text-slate-300 mb-2 font-bold'>{props.workoutDefinition.title}</Text>
      {props.workoutDefinition.exercises.map((exercise, index) =>
        <Text key={index} className='text-gray-300'>{exercise}</Text>
      )}
    </TouchableOpacity>
  );
}
