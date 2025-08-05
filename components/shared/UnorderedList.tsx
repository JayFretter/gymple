import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text } from "react-native";

export interface UnorderedListProps {
  texts: string[];
  className?: string;
  checks?: boolean;
  checkColor?: string;
}

export default function UnorderedList({ texts, className, checks, checkColor }: UnorderedListProps) {
  return (
    <View className={`flex ${className}`}>
      {texts.map((text, index) => (
        <View key={index} className="flex-row items-start mb-1 ">
          { checks ? 
            <AntDesign className="mr-2 mt-1" name="check" size={14} color={checkColor || "white"} /> :
            <Text className="text-txt-secondary mr-2 scale-[2]">{'\u2022'}</Text>
          }
          <Text className="text-txt-secondary">{text}</Text>
        </View>
      ))}
    </View>
  );
};