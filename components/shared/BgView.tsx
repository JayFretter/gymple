import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";

export interface BgViewProps {
  children: React.ReactNode;
  className?: string;
}

export default function BgView({ children, className }: BgViewProps) {
  const { colorScheme } = useColorScheme();

  return (
    <LinearGradient
      colors={colorScheme === 'dark' ? ['#100F1E', '#100011'] : ['#E2E0FF', '#ffffff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={`flex-1 ${className}`}
    >
      {children}
    </LinearGradient>
  );
}