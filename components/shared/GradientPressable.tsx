import { GestureResponderEvent, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type GradientPressableProps = {
  className?: string;
  style?: 'default' | 'green' | 'gray' | 'red' | 'subtleHighlight';
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
        borderColor: null,
      },
      green: {
        gradientStart: '#2D853A',
        gradientEnd: '#2D853A',
        borderColor: null,
      },
      gray: {
        gradientStart: '#181818',
        gradientEnd: '#18181A',
        borderColor: null,
      },
      red: {
        gradientStart: '#D51F31',
        gradientEnd: '#D51F31',
        borderColor: null,
      },
      subtleHighlight: {
        gradientStart: '#181818',
        gradientEnd: '#18181A',
        borderColor: '#2a53b5',
      }
    }
  };

  // For simplicity, we are only using the 'dark' style here (TODO)
  const currentStyle = buttonStyles.dark[style] || buttonStyles.dark.default;

  return (
    <Pressable
      className={className + ' active:opacity-75 overflow-hidden rounded-xl ' + (disabled ? 'opacity-50' : '')}
      style={{ borderColor: currentStyle.borderColor ?? undefined, borderWidth: currentStyle.borderColor ? 1 : 0 }}
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
