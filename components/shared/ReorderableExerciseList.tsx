import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect, useState } from "react";
import { ListRenderItemInfo, Pressable, Text, View } from "react-native";
import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
  useReorderableDrag,
} from 'react-native-reorderable-list';
import MuscleIcon from "./MuscleIcon";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";


interface DraggableExerciseCardProps {
  item: ExerciseDefinition;
  deleteCallback?: (exerciseId: string) => void;
}

const DraggableExerciseCard = ({item, deleteCallback} : DraggableExerciseCardProps) => {
  const drag = useReorderableDrag();

  return (
    <Pressable
        onLongPress={drag}
        className="bg-card flex-row items-center justify-between px-4 py-2 rounded-lg mb-4"
      >
        <View className="flex-row items-center gap-4">
          <MuscleIcon category={item.categories[0]} size={30} />
          <Text className="text-txt-primary text-lg">{item.name}</Text>
        </View>
        <Pressable onPress={() => deleteCallback?.(item.id)}>
            <MaterialIcons name="delete-outline" size={22} color="#555555" />
        </Pressable>
      </Pressable>
  );
};

export interface ReorderableExerciseListProps {
  className?: string;
  exercises: ExerciseDefinition[];
  onDelete?: (exerciseId: string) => void;
  onReorder?: (newExerciseList: ExerciseDefinition[]) => void;
}

export default function ReorderableExerciseList({ className, exercises, onDelete, onReorder }: ReorderableExerciseListProps) {
  const [data, setData] = useState(exercises);

  useEffect(() => {
    setData(exercises);
  }, [exercises]);

  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    const reorderedItems = reorderItems(data, from, to);
    setData(reorderedItems);
    onReorder?.(reorderedItems);
  };

  const renderItem = ({ item }: ListRenderItemInfo<ExerciseDefinition>) => (
    <DraggableExerciseCard item={item} deleteCallback={onDelete} />
  );

  return (
    <ReorderableList
      data={data}
      onReorder={handleReorder}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
}