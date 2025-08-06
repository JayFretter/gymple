import React, { createContext, useEffect } from "react";
import { View } from "react-native";
import { useColorScheme } from "nativewind";
import { themes } from "@/utils/colour-scheme";
import useUserPreferences from "@/hooks/useUserPreferences";
import { set } from "date-fns";

interface ThemeProviderProps {
  children: React.ReactNode;
}
export const ThemeContext = createContext<{
  theme: "light" | "dark";
}>({
  theme: "light",
});
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [getUserPreferences] = useUserPreferences();

  useEffect(() => {
    const userPreferences = getUserPreferences();
    setColorScheme(userPreferences.colourScheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: colorScheme ?? 'light' }}>
      <View style={themes[colorScheme ?? 'light']} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};