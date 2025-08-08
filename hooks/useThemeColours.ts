import { themeColours, themeColoursExperimental } from "@/utils/colour-scheme";
import { useColorScheme } from "nativewind";

export type ThemeColourName =
  | "primary"
  | "card"
  | "tertiary"
  | "txt-primary"
  | "txt-secondary"
  | "txt-tertiary"
  | "highlight"
  | "highlight-subtle"
  | "navbar";

export default function useThemeColours() {
  const { colorScheme } = useColorScheme();

  const themeColour = (name: ThemeColourName): string => {
    return themeColoursExperimental[colorScheme ?? "light"][`--color-${name}` as keyof typeof themeColours["light"]] || "";
    // return themeColours[colorScheme ?? "light"][`--color-${name}` as keyof typeof themeColours["light"]] || "";
  };

  return themeColour;
}