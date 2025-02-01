import { Text, TouchableOpacity, View } from 'react-native';

export type WorkoutTileProps = {
  title: string;
  exercises: string[];
};

export function WorkoutTile(props: WorkoutTileProps) {
  return (
    <TouchableOpacity className='bg-slate-700 w-64 p-4 flex items-center justify-center rounded-3xl'>
        <Text className='text-4xl text-green-300 mb-2'>{props.title}</Text>
        {props.exercises.map((exercise, index) => 
          <Text key={index} className='text-gray-300'>{exercise}</Text>
        )}
      </TouchableOpacity>
  );
}
