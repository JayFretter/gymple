import { GestureResponderEvent, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type GradientPressableProps = {
  className?: string;
  style?: 'default' | 'green' | 'gray' | 'red';
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

export default function GradientPressable({ className, style = 'gray', children, onPress, disabled = false }: GradientPressableProps) {
  // Define styles based on the style prop
  const buttonStyles = {
    dark: {
      default: {
        gradientStart: '#2a53b5',
        gradientEnd: '#2a53b5',
      },
      green: {
        gradientStart: '#2D853A',
        gradientEnd: '#2D853A',
      },
      gray: {
        gradientStart: '#222222',
        gradientEnd: '#22222A',
      },
      red: {
        gradientStart: '#D51F31',
        gradientEnd: '#D51F31',
      }
    }
  };

  // For simplicity, we are only using the 'dark' style here (TODO)
  const currentStyle = buttonStyles.dark[style] || buttonStyles.dark.default;

  return (
    <Pressable
      className={className + ' active:opacity-75 overflow-hidden rounded-xl ' + (disabled ? 'opacity-50' : '')}
      onPress={onPress}
      disabled={disabled}
    >
      <LinearGradient
        colors={[currentStyle.gradientStart, currentStyle.gradientEnd]}
      >
        {children}
      </LinearGradient>
    </Pressable>
  );
}
