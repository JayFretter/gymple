import { GestureResponderEvent, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type GradientPressableProps = {
  className?: string;
  style: 'default' | 'green';
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
};

export default function GradientPressable({className, style, children, onPress}: GradientPressableProps) {
  // Define styles based on the style prop
  const buttonStyles = {
    dark: {
      default: {
        gradientStart: '#555555',
        gradientEnd: '#333333',
        borderColor: '#068bec', // Orange
      },
      green: {
        gradientStart: '#22c55e',
        gradientEnd: '#22c55e44',
        borderColor: '#00000000', // No border
      }
    }
  };

  // For simplicity, we are only using the 'dark' style here (TODO)
  const currentStyle = buttonStyles.dark[style] || buttonStyles.dark.default;

  return (
    <Pressable
      className={className + ' active:opacity-80'}
      onPress={onPress}
    >
      <LinearGradient
      className='p-4'
        // Background Linear Gradient
        colors={[currentStyle.gradientStart, currentStyle.gradientEnd]}
        style={{
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: currentStyle.borderColor,
        }}
      >
        {children}
      </LinearGradient>
    </Pressable>
  );
}
