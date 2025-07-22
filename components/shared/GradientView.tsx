import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

export type GradientViewProps = {
  className?: string;
  style: 'default' | 'green' | 'gray';
  children?: React.ReactNode;
};

export default function GradientView({ className, style, children }: GradientViewProps) {
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
        gradientEnd: '#333333F0',
        borderColor: '#374151',
      }
    }
  };

  // For simplicity, we are only using the 'dark' style here (TODO)
  const currentStyle = buttonStyles.dark[style] || buttonStyles.dark.default;

  return (
    <View
      className={className + ' active:opacity-75 overflow-hidden rounded-xl'}
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
    </View>
  );
}
