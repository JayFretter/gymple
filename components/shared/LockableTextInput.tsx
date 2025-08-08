import FontAwesome from "@expo/vector-icons/FontAwesome";
import { forwardRef } from "react";
import { TextInput, TextInputProps, View } from "react-native";

interface LockableTextInputProps extends TextInputProps {
  locked: boolean;
}

const LockableTextInput = forwardRef<TextInput, LockableTextInputProps>(({ locked, ...textInputProps }, ref) => {
  return (
    <View className="bg-card rounded-lg px-2">
      <TextInput {...textInputProps} editable={!locked} ref={ref} className={`${locked ? "text-txt-secondary" : "text-txt-primary"}`} />
      <FontAwesome
        className="absolute right-4 top-1/2 -translate-y-1/2"
        style={{ opacity: locked ? 1 : 0 }}
        name="lock"
        size={14}
        color="#888"
      />
    </View>
  )
});

export default LockableTextInput;