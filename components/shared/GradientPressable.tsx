import { GestureResponderEvent, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type GradientPressableProps = {
  className?: string;
  style: 'default' | 'green';
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
        borderColor: '#068bec', // Blue
      },
      green: {
        gradientStart: '#222222',
        gradientEnd: '#337742F0',
        borderColor: '#06ec57', // No border
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
        // Background Linear Gradient
        colors={[currentStyle.gradientStart, currentStyle.gradientEnd]}
      >
        {children}
      </LinearGradient>
    </Pressable>
  );
}
