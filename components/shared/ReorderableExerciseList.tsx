import ExerciseDefinition from "@/interfaces/ExerciseDefinition";
import { ExerciseWithSets } from "@/hooks/useWorkoutBuilderStore";
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
import useThemeColours from "@/hooks/useThemeColours";
import SwipeDeleteView from "./SwipeDeleteView";



interface DraggableExerciseCardProps {
  item: ExerciseWithSets;
  deleteCallback?: (exerciseId: string) => void;
  onSetChange?: (exerciseId: string, sets: number) => void;
}

const DraggableExerciseCard = ({ item, deleteCallback, onSetChange }: DraggableExerciseCardProps) => {
  const drag = useReorderableDrag();
  const themeColour = useThemeColours();

  const handleDecrement = () => {
    if (onSetChange) onSetChange(item.exercise.id, Math.max(1, item.sets - 1));
  };
  const handleIncrement = () => {
    if (onSetChange) onSetChange(item.exercise.id, item.sets + 1);
  };

  return (
    <SwipeDeleteView onDismiss={() => deleteCallback?.(item.exercise.id)}>
      <Pressable
        onLongPress={drag}
        className="bg-card flex-row items-center justify-between px-4 py-2 rounded-lg mb-4"
      >
        <View className="flex-row items-center gap-4 max-w-[60%]">
          <MuscleIcon category={item.exercise.categories[0]} size={30} />
          <Text numberOfLines={2} className="text-txt-primary text-lg">{item.exercise.name}</Text>
        </View>
        <View className="flex items-center">
          {/* <Text className="text-txt-secondary text-sm">Sets</Text> */}
          <View className="flex-row items-center gap-4">
            <Pressable onPress={handleDecrement}>
              <AntDesign name="minus" size={18} color={themeColour('txt-tertiary')} />
            </Pressable>
            <Text className="text-txt-primary text-center">{item.sets}</Text>
            <Pressable onPress={handleIncrement}>
              <AntDesign name="plus" size={18} color={themeColour('txt-tertiary')} />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </SwipeDeleteView>
  );
};

export interface ReorderableExerciseListProps {
  className?: string;
  exercises: ExerciseWithSets[];
  onDelete?: (exerciseId: string) => void;
  onReorder?: (newExerciseList: ExerciseWithSets[]) => void;
  onSetChange?: (exerciseId: string, sets: number) => void;
}

export default function ReorderableExerciseList({ className, exercises, onDelete, onReorder, onSetChange }: ReorderableExerciseListProps) {
  const [data, setData] = useState<ExerciseWithSets[]>(exercises);

  useEffect(() => {
    setData(exercises);
  }, [exercises]);

  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    const reorderedItems = reorderItems(data, from, to);
    setData(reorderedItems);
    onReorder?.(reorderedItems);
  };

  const renderItem = ({ item }: ListRenderItemInfo<ExerciseWithSets>) => (
    <DraggableExerciseCard item={item} deleteCallback={onDelete} onSetChange={onSetChange} />
  );

  return (
    <ReorderableList
      showsVerticalScrollIndicator={false}
      data={data}
      onReorder={handleReorder}
      renderItem={renderItem}
      keyExtractor={item => item.exercise.id}
    />
  );
}