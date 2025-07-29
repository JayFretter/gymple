import useStatusBarStore from "@/hooks/useStatusBarStore";
import { View } from "react-native";


export default function StatusBar() {
  const children = useStatusBarStore((state) => state.node);

  if (children) {
    return (
      <View className='w-full py-1 pl-4 flex justify-center bg-blue-500'>
        {children}
      </View>
    );
  }

  return null;
}