import { GestureResponderEvent, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type GradientPressableProps = {
  className?: string;
  style: 'default' | 'green' | 'gray';
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
};

export default function GradientPressable({ className, style, children, onPress }: GradientPressableProps) {
  // Define styles based on the style prop
  const buttonStyles = {
    dark: {
      default: {
        gradientStart: '#222222',
        gradientEnd: '#333377F0',
        borderColor: '#068bec',
      },
      green: {
        gradientStart: '#222222',
        gradientEnd: '#25522eF0',
        borderColor: '#0aad43',
      },
      gray: {
        gradientStart: '#222222',
        gradientEnd: '#22222A',
        borderColor: '#374151',
      }
    }
  };

  // For simplicity, we are only using the 'dark' style here (TODO)
  const currentStyle = buttonStyles.dark[style] || buttonStyles.dark.default;

  return (
    <Pressable
      className={className + ' active:opacity-75 overflow-hidden rounded-xl'}
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: currentStyle.borderColor,
      }}
    >
      <LinearGradient
        colors={[currentStyle.gradientStart, currentStyle.gradientEnd]}
      >
        {children}
      </LinearGradient>
    </Pressable>
  );
}
